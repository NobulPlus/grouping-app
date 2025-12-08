import type { Request, Response } from 'express';
import User from '../models/User';
import Group from '../models/Group';
import groupAssigner from '../utils/groupAssignment';
import { validationResult } from 'express-validator';

export class UserController {
  /**
   * Register a new user
   */
  public async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      // Validate request
      console.log('[REGISTER] validation start');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('[REGISTER] validation failed', errors.array());
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      console.log('[REGISTER] validation passed');
      const { surname, firstName, middleName, email, phone } = req.body;
      console.log('[REGISTER] payload:', { surname, firstName, middleName, email, phone });
      
      // Check if user already exists
      const uniqueId = `${surname.toLowerCase()}-${firstName.toLowerCase()}-${middleName.toLowerCase()}`;
      const existingUser = await User.findOne({ uniqueIdentifier: uniqueId });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this name combination already exists',
          existingUser: {
            id: existingUser._id,
            group: existingUser.groupName,
            registeredDate: existingUser.registrationDate
          }
        });
      }
      
      // Assign to a group
      const groupAssignment = await groupAssigner.assignGroup();
      
      // Find the group document
      const group = await Group.findById(groupAssignment.groupId);
      if (!group) {
        throw new Error('Assigned group not found');
      }
      
      // Create user
      const user = await User.create({
        surname,
        firstName,
        middleName,
        email,
        phone,
        group: groupAssignment.groupId,
        groupName: groupAssignment.groupName,
        groupColor: groupAssignment.groupColor,
        groupColorCode: groupAssignment.groupColorCode,
        uniqueIdentifier: uniqueId,
        metadata: {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        }
      });
      
      // Update group count
      await Group.findByIdAndUpdate(groupAssignment.groupId, {
        $inc: { currentCount: 1 }
      });
      
      // Return success response
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            fullName: `${user.firstName} ${user.middleName} ${user.surname}`,
            group: user.groupName,
            groupColor: user.groupColor,
            groupColorCode: user.groupColorCode,
            positionInGroup: groupAssignment.positionInGroup,
            totalInGroup: groupAssignment.totalInGroup,
            registrationDate: user.registrationDate
          },
          assignment: groupAssignment
        }
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Get user by ID
   */
  public async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findById(req.params.id)
        .populate('group', 'name color colorCode')
        .select('-__v');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Check if name exists
   */
  public async checkNameExists(req: Request, res: Response): Promise<Response> {
    try {
      const { surname, firstName, middleName } = req.query;
      
      if (!surname || !firstName || !middleName) {
        return res.status(400).json({
          success: false,
          message: 'All name fields are required'
        });
      }
      
      const uniqueId = `${surname.toString().toLowerCase()}-${firstName.toString().toLowerCase()}-${middleName.toString().toLowerCase()}`;
      const existingUser = await User.findOne({ uniqueIdentifier: uniqueId });
      
      return res.json({
        success: true,
        exists: !!existingUser,
        user: existingUser ? {
          group: existingUser.groupName,
          registeredDate: existingUser.registrationDate
        } : null
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Get all users in a group
   */
  public async getGroupMembers(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const { limit = '20', page = '1' } = req.query;
      
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }
      
      const limitNum = parseInt(limit as string);
      const pageNum = parseInt(page as string);
      const skip = (pageNum - 1) * limitNum;
      
      const [members, total] = await Promise.all([
        User.find({ group: groupId })
          .sort({ registrationDate: -1 })
          .skip(skip)
          .limit(limitNum)
          .select('surname firstName middleName registrationDate lastActive'),
        User.countDocuments({ group: groupId })
      ]);
      
      return res.json({
        success: true,
        data: {
          group: {
            id: group._id,
            name: group.name,
            color: group.color,
            colorCode: group.colorCode
          },
          members,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum)
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
  
  /**
   * Get user statistics
   */
  public async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const totalUsers = await User.countDocuments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayRegistrations = await User.countDocuments({
        registrationDate: { $gte: today }
      });
      
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const weeklyRegistrations = await User.countDocuments({
        registrationDate: { $gte: lastWeek }
      });
      
      return res.json({
        success: true,
        data: {
          totalUsers,
          todayRegistrations,
          weeklyRegistrations,
          averagePerDay: totalUsers > 0 ? (totalUsers / 30).toFixed(1) : 0 // Assuming 30 days
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
}

export default new UserController();