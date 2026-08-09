import { useEffect } from "react";
import {
  onFriendRequestReceived,
  onFriendRequestUpdated,
  onFriendRequestActionDone,
} from "@/socket/socketListeners";

export const useFriendRequestSocket = ({
  onReceive,
  onUpdate,
  onActionDone,
}) => {
  useEffect(() => {
    if (onReceive) onFriendRequestReceived(onReceive);
    if (onUpdate) onFriendRequestUpdated(onUpdate);
    if (onActionDone) onFriendRequestActionDone(onActionDone);
  }, []);
};
