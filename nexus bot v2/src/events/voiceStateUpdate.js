module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState, client) {
    const userId = newState.id;

    if (!oldState.channelId && newState.channelId) {
      client.voiceTime.set(userId, Date.now());
    }

    if (oldState.channelId && !newState.channelId) {
      const joinTime = client.voiceTime.get(userId);
      if (joinTime) {
        const duration = Date.now() - joinTime;
        const activity = client.userActivity.get(userId) || { voice: 0, messages: 0 };
        activity.voice += duration;
        client.userActivity.set(userId, activity);
        client.voiceTime.delete(userId);
      }
    }
  }
};