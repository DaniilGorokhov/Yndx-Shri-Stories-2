// Return data in required view for activity slide.
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
