const { TenderRecommendation, Tender, User } = require('../models');
const { Op } = require('sequelize');

const MATCH_WEIGHTS = {
  category:   30,
  location:   20,
  budgetFit:  20,
  experience: 15,
  winRate:    10,
  deadline:    5
};

// async function scoreTenderForBidder(tender, profile) {
//   let totalScore = 0;
//   const breakdown = {};
//   const reasons = [];

//   // 1. Category match — uses 'expertise' JSON array
//   const expertise = profile.expertise || [];
//   const categoryMatch = expertise.some(e =>
//     tender.category?.toLowerCase().includes(e.toLowerCase()) ||
//     e.toLowerCase().includes(tender.category?.toLowerCase())
//   );
//   const catScore = categoryMatch ? MATCH_WEIGHTS.category : 0;
//   breakdown.category = catScore;
//   if (categoryMatch) reasons.push(`Matches your expertise in ${tender.category}`);
//   totalScore += catScore;

//   // 2. Location match — uses 'city' column
//   const locationMatch = !tender.location ||
//     tender.location?.toLowerCase() === profile.city?.toLowerCase() ||
//     tender.location?.toLowerCase() === 'national';
//   const locScore = locationMatch ? MATCH_WEIGHTS.location : MATCH_WEIGHTS.location * 0.3;
//   breakdown.location = locScore;
//   if (locationMatch) reasons.push('Located in your operating region');
//   totalScore += locScore;

//   // 3. Budget fit — no avgContractValue in your model, use yearsOfExperience as proxy
//   // Senior bidders (10+ years) can handle larger budgets
//   const maxBudget = (profile.yearsOfExperience || 0) * 500000;
//   const budgetScore = tender.budget <= maxBudget ? MATCH_WEIGHTS.budgetFit :
//                       tender.budget <= maxBudget * 2 ? MATCH_WEIGHTS.budgetFit * 0.5 : 0;
//   breakdown.budgetFit = budgetScore;
//   if (budgetScore === MATCH_WEIGHTS.budgetFit) reasons.push('Budget aligns with your capacity');
//   totalScore += budgetScore;

//   // 4. Experience — uses 'yearsOfExperience'
//   const expScore = (profile.yearsOfExperience || 0) >= 2
//     ? MATCH_WEIGHTS.experience : 0;
//   breakdown.experience = expScore;
//   if (expScore > 0) reasons.push(`${profile.yearsOfExperience} years of experience`);
//   totalScore += expScore;

//   // 5. Win rate — not in BidderProfile, give default mid score
//   breakdown.winRate = MATCH_WEIGHTS.winRate * 0.5;
//   totalScore += MATCH_WEIGHTS.winRate * 0.5;

//   // 6. Deadline — at least 7 days remaining
//   const daysLeft = Math.floor((new Date(tender.deadline) - new Date()) / 86400000);
//   const deadlineScore = daysLeft >= 7 ? MATCH_WEIGHTS.deadline :
//                         daysLeft >= 3 ? MATCH_WEIGHTS.deadline * 0.5 : 0;
//   breakdown.deadline = deadlineScore;
//   if (daysLeft >= 7) reasons.push(`${daysLeft} days left to prepare`);
//   totalScore += deadlineScore;

//   return {
//     matchScore:     Math.min(100, +totalScore.toFixed(1)),
//     matchReasons:   reasons,
//     matchBreakdown: breakdown
//   };
// }
async function scoreTenderForBidder(tender, profile) {
  let totalScore = 0;
  const breakdown = {};
  const reasons = [];

  // Parse expertise safely
  let expertise = profile.expertise || [];
  if (typeof expertise === 'string') {
    try { expertise = JSON.parse(expertise); } catch { expertise = []; }
  }
// ADD THIS: ensure it's always an array, no matter what came back
if (!Array.isArray(expertise)) {
  expertise = expertise ? [expertise] : [];
}

  // 1. Category match (30pts)
  // Check expertise array AND businessCategory field
  const tenderCat = tender.category?.toLowerCase() || '';
  const bizCat    = (profile.businessCategory || '').toLowerCase();
  const categoryMatch =
    expertise.some(e =>
      tenderCat.includes(e.toLowerCase()) ||
      e.toLowerCase().includes(tenderCat)
    ) ||
    bizCat.includes(tenderCat) ||
    tenderCat.includes(bizCat);

  const catScore = categoryMatch ? MATCH_WEIGHTS.category : 0;
  breakdown.category = catScore;
  if (categoryMatch) reasons.push(`Matches your expertise in ${tender.category}`);
  totalScore += catScore;


  // 2. Location match (20pts) — city vs tender.location
  const userCity     = (profile.city || '').toLowerCase();
  const tenderLoc    = (tender.location || '').toLowerCase();
  const locationMatch = userCity && tenderLoc && (
    userCity.includes(tenderLoc) ||
    tenderLoc.includes(userCity) ||
    tenderLoc === 'national' ||
    tenderLoc === 'nationwide'
  );
  const locScore = locationMatch
    ? MATCH_WEIGHTS.location
    : userCity ? MATCH_WEIGHTS.location * 0.3 : 0;
  breakdown.location = locScore;
  if (locationMatch) reasons.push(`Based in ${tender.location}`);
  totalScore += locScore;

  // 3. Budget fit (20pts) — use yearsInBusiness as capacity proxy
  const years      = parseInt(profile.yearsInBusiness || profile.yearsOfExperience) || 0;
  const maxBudget  = Math.max(years * 300000, 500000); // min 500K capacity
  const budgetRatio = tender.budget / maxBudget;
  let budgetScore = 0;
  if (budgetRatio <= 1.5)       budgetScore = MATCH_WEIGHTS.budgetFit;        // within capacity
  else if (budgetRatio <= 3.0)  budgetScore = MATCH_WEIGHTS.budgetFit * 0.5;  // slightly above
  else                          budgetScore = MATCH_WEIGHTS.budgetFit * 0.1;  // too large
  breakdown.budgetFit = +budgetScore.toFixed(1);
  if (budgetScore === MATCH_WEIGHTS.budgetFit) reasons.push('Budget fits your capacity');
  totalScore += budgetScore;

  // 4. Experience (15pts)
  const expYears  = parseInt(profile.yearsOfExperience || profile.yearsInBusiness) || 0;
  const expScore  = expYears >= 10 ? MATCH_WEIGHTS.experience :
                    expYears >= 5  ? MATCH_WEIGHTS.experience * 0.8 :
                    expYears >= 2  ? MATCH_WEIGHTS.experience * 0.6 :
                    expYears >= 1  ? MATCH_WEIGHTS.experience * 0.3 : 0;
  breakdown.experience = +expScore.toFixed(1);
  if (expYears > 0) reasons.push(`${expYears} years of experience`);
  totalScore += expScore;

  // 5. Win rate (10pts) — calculated from DB if available
  const winRate   = parseFloat(profile.winRate) || 0;
  const winScore  = winRate >= 0.4 ? MATCH_WEIGHTS.winRate :
                    winRate >= 0.25 ? MATCH_WEIGHTS.winRate * 0.7 :
                    winRate > 0     ? MATCH_WEIGHTS.winRate * 0.4 :
                    MATCH_WEIGHTS.winRate * 0.2; // default if no history
  breakdown.winRate = +winScore.toFixed(1);
  totalScore += winScore;

  // 6. Deadline (5pts)
  const daysLeft     = Math.floor((new Date(tender.deadline) - new Date()) / 86400000);
  const deadlineScore = daysLeft >= 14 ? MATCH_WEIGHTS.deadline :
                        daysLeft >= 7  ? MATCH_WEIGHTS.deadline * 0.8 :
                        daysLeft >= 3  ? MATCH_WEIGHTS.deadline * 0.5 : 0;
  breakdown.deadline = deadlineScore;
  if (daysLeft >= 7) reasons.push(`${daysLeft} days left to prepare`);
  totalScore += deadlineScore;

  return {
    matchScore:     Math.min(100, +totalScore.toFixed(1)),
    matchReasons:   reasons,
    matchBreakdown: breakdown
  };
}

async function generateRecommendations(userId) {
  // Get user without BidderProfile association (not defined in User model)
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  if (user.role !== 'bidder') throw new Error('Only bidders get recommendations');

  // Fetch BidderProfile separately using the raw model
  const { BidderProfile } = require('../models');
  const profile = await BidderProfile.findOne({ where: { userId } });

  // Get tenders bidder hasn't applied to
  const { Bid } = require('../models');
  const appliedBids = await Bid.findAll({
    where: { userId, deletedAt: null },
    attributes: ['tenderId']
  });
  const appliedTenderIds = appliedBids.map(b => b.tenderId);

  const whereClause = {
    status: 'published',
    deadline: { [Op.gt]: new Date() },
    deletedAt: null,
    ...(appliedTenderIds.length > 0 ? { id: { [Op.notIn]: appliedTenderIds } } : {})
  };

  const openTenders = await Tender.findAll({ where: whereClause });

  // If no profile, return all open tenders with a base score
  if (!profile) {
    const basicRecs = openTenders.slice(0, 10).map(tender => ({
      tenderId: tender.id,
      matchScore: 50,
      matchReasons: ['Complete your profile for better matches'],
      matchBreakdown: {},
      Tender: tender
    }));
    return basicRecs;
  }

  const recommendations = [];

  for (const tender of openTenders) {
    const { matchScore, matchReasons, matchBreakdown } =
      await scoreTenderForBidder(tender, profile);

    if (matchScore >= 40) {
      await TenderRecommendation.upsert({
        userId,
        tenderId:       tender.id,
        matchScore,
        matchReasons,
        matchBreakdown,
        generatedAt:    new Date(),
        createdAt:      new Date(),
        updatedAt:      new Date()
      });
      recommendations.push({ tenderId: tender.id, matchScore, matchReasons, matchBreakdown, Tender: tender });
    }
  }

  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  return recommendations.slice(0, 10);
}

module.exports = { generateRecommendations };