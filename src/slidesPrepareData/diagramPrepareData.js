const { getFormattedText } = require('../helpers/dataHandlers/getFormattedText');

function diagramPrepareData(activeStatistics, previousStatistics, { name }) {
  const getDifferenceValue = (value) => {
    if (value > 0) {
      return `+${value}`;
    }
    return value.toString();
  };

  const activeTotal = Object.values(activeStatistics).reduce(
    (sum, value) => sum + value,
    0,
  );

  const totalText = getFormattedText(
    activeTotal,
    'коммит',
    {
      one: '',
      twoFive: 'а',
      other: 'ов',
    },
  );

  const previousTotal = Object.values(previousStatistics).reduce(
    (sum, value) => sum + value,
    0,
  );

  const differenceTotalText = getDifferenceValue(activeTotal - previousTotal);

  const baseConfig = [
    'коммит',
    {
      one: '',
      twoFive: 'а',
      other: 'ов',
    },
  ];
  const categoriesData = [
    {
      valueText: getFormattedText(
        activeStatistics.extra,
        ...baseConfig,
      ),
      differenceText: getFormattedText(
        activeStatistics.extra - previousStatistics.extra,
        ...baseConfig,
        { valueHandler: getDifferenceValue },
      ),
    },
    {
      valueText: getFormattedText(
        activeStatistics.max,
        ...baseConfig,
      ),
      differenceText: getFormattedText(
        activeStatistics.max - previousStatistics.max,
        ...baseConfig,
        { valueHandler: getDifferenceValue },
      ),
    },
    {
      valueText: getFormattedText(
        activeStatistics.mid,
        ...baseConfig,
      ),
      differenceText: getFormattedText(
        activeStatistics.mid - previousStatistics.mid,
        ...baseConfig,
        { valueHandler: getDifferenceValue },
      ),
    },
    {
      valueText: getFormattedText(
        activeStatistics.min,
        ...baseConfig,
      ),
      differenceText: getFormattedText(
        activeStatistics.min - previousStatistics.min,
        ...baseConfig,
        { valueHandler: getDifferenceValue },
      ),
    },
  ];

  const diagramSlideData = {
    alias: 'diagram',
    data: {
      title: 'Размер коммитов',
      subtitle: name,
      totalText,
      differenceText: `${differenceTotalText} с прошлого спринта`,
      categories: [
        {
          title: '> 1001 строки',
          valueText: categoriesData[0].valueText,
          differenceText: categoriesData[0].differenceText,
        },
        {
          title: '501 — 1000 строк',
          valueText: categoriesData[1].valueText,
          differenceText: categoriesData[1].differenceText,
        },
        {
          title: '101 — 500 строк',
          valueText: categoriesData[2].valueText,
          differenceText: categoriesData[2].differenceText,
        },
        {
          title: '1 — 100 строк',
          valueText: categoriesData[3].valueText,
          differenceText: categoriesData[3].differenceText,
        },
      ],
    },
  };

  return diagramSlideData;
}

module.exports = {
  diagramPrepareData,
};
