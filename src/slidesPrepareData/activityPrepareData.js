function activityPrepareData(heatMapData, { name }) {
  const activitySlideData = {
    alias: 'activity',
    data: {
      title: 'Коммиты',
      subtitle: name,
      data: heatMapData,
    },
  };

  return activitySlideData;
}

module.exports = {
  activityPrepareData,
};
