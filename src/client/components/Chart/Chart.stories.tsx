import Chart from './Chart'

export default {
  title: 'Components/Chart',
  component: Chart,
};

const sampleData = [
  { time: '2023-10-01', value: 45000 },
  { time: '2023-10-02', value: 46000 },
  { time: '2023-10-03', value: 47000 },
].map(item => ({
  time: Date.parse(item.time),
  priceUsd: item.value.toString(),
}))

export const Default = () => <Chart data={sampleData} />
