import { MentorProfileService } from '../services/mentor.profile.service.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const getMentorProfile = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    logger.error('Get mentor profile error:', error);
    next(error);
  }
};

export const updateBasicInfo = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.updateBasicInfo(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    logger.error('Update basic info error:', error);
    next(error);
  }
};

export const updateExpertise = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.updateExpertise(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    logger.error('Update expertise error:', error);
    next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.updateEducation(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    logger.error('Update education error:', error);
    next(error);
  }
};

export const updateSocialLinks = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.updateSocialLinks(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    logger.error('Update social links error:', error);
    next(error);
  }
};

export const updateCustomUrl = async (req, res, next) => {
  try {
    const profile = await MentorProfileService.updateCustomUrl(req.user.id, req.body.customUrl);
    res.json(profile);
  } catch (error) {
    logger.error('Update custom URL error:', error);
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }
    const avatarUrl = await MentorProfileService.updateAvatar(req.user.id, req.file);
    res.json({ avatarUrl });
  } catch (error) {
    logger.error('Update avatar error:', error);
    next(error);
  }
};