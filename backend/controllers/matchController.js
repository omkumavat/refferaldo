const Candidate = require('../models/CandidateProfile'),
    Job = require('../models/Job'),
    Match = require('../models/Match'),
    ai = require('../services/aiService');
const {
    ok,
    fail
} = require('../utils/api');

