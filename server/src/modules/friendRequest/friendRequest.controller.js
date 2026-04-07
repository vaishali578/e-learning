import { syncFriendDataService } from "./friendRequest.service.js";

export const syncFriendData = async (req, res) => {
  try {
    const userId = req.user.id; 

    const data = await syncFriendDataService(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to sync friend data",
    });
  }
};