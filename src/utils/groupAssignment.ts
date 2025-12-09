import Group, { IGroup } from '../models/Group';
import User from '../models/User';

export interface GroupAssignmentResult {
  groupId: string;
  groupName: string;
  groupColor: string;
  groupColorCode: string;
  positionInGroup: number;
  totalInGroup: number;
}

export class GroupAssigner {
  private static instance: GroupAssigner;
  
  private constructor() {}
  
  public static getInstance(): GroupAssigner {
    if (!GroupAssigner.instance) {
      GroupAssigner.instance = new GroupAssigner();
    }
    return GroupAssigner.instance;
  }
  
  /**
   * Assign user to a randomly selected group from those with the fewest members
   */
  public async assignGroup(): Promise<GroupAssignmentResult> {
    try {
      // Get all active groups with their current counts
      const groups = await Group.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'group',
            as: 'members'
          }
        },
        {
          $addFields: {
            currentCount: { $size: '$members' },
            isFull: {
              $cond: [
                { $eq: ['$maxCapacity', null] },
                false,
                { $gte: [{ $size: '$members' }, '$maxCapacity'] }
              ]
            }
          }
        },
        { $match: { isFull: false } },
        { $sort: { currentCount: 1 } }
      ]);
      
      if (groups.length === 0) {
        throw new Error('No available groups. All groups may be at full capacity.');
      }
      
      // Find the minimum count
      const minCount = groups[0].currentCount;
      
      // Get all groups with the minimum count
      const groupsWithMinCount = groups.filter(g => g.currentCount === minCount);
      
      // Randomly select one of the groups with minimum count
      const randomIndex = Math.floor(Math.random() * groupsWithMinCount.length);
      const assignedGroup = groupsWithMinCount[randomIndex];
      
      // Return assignment result
      return {
        groupId: assignedGroup._id.toString(),
        groupName: assignedGroup.name,
        groupColor: assignedGroup.color,
        groupColorCode: assignedGroup.colorCode,
        positionInGroup: assignedGroup.currentCount + 1,
        totalInGroup: assignedGroup.currentCount + 1
      };
    } catch (error) {
      console.error('Group assignment error:', error);
      throw error;
    }
  }
  
  /**
   * Get group statistics
   */
  public async getGroupStats() {
    return await Group.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'group',
          as: 'members'
        }
      },
      {
        $project: {
          name: 1,
          color: 1,
          colorCode: 1,
          maxCapacity: 1,
          memberCount: { $size: '$members' },
          percentageFull: {
            $cond: [
              { $eq: ['$maxCapacity', null] },
              null,
              {
                $multiply: [
                  { $divide: [{ $size: '$members' }, '$maxCapacity'] },
                  100
                ]
              }
            ]
          },
          members: {
            $slice: ['$members', 10] // Get first 10 members
          }
        }
      },
      { $sort: { order: 1 } }
    ]);
  }
  
  /**
   * Rebalance groups (admin function)
   */
  public async rebalanceGroups(): Promise<{ moved: number; message: string }> {
    // This is advanced logic for evenly distributing users
    // Implement if needed
    return { moved: 0, message: 'Rebalancing not implemented' };
  }
}

export default GroupAssigner.getInstance();