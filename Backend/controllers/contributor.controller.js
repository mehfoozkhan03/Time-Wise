export const getTopContributors = async (req, res) => {
  try {
    const contributors = await postModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$createdBy',
          totalPosts: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalPosts: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          totalPosts: 1,
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          designation: '$user.designation',
          department: '$user.department',
          profileImage: '$user.profileImage',
        },
      },
    ])

    return res.status(200).json({
      success: true,
      contributors,
    })
  } catch (error) {
    console.error('Top Contributors Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch contributors.',
    })
  }
}
