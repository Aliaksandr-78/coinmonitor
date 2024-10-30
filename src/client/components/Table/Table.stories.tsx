import Table from './Table'

export default {
  title: 'Components/Table',
  component: Table,
}

export const Default = () => (
  <Table headers={['Header 1', 'Header 2', 'Header 3']}>
    <thead>
      <tr>
        <th>Заголовок 1</th>
        <th>Заголовок 2</th>
        <th>Заголовок 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ячейка 1</td>
        <td>Ячейка 2</td>
        <td>Ячейка 3</td>
      </tr>
    </tbody>
  </Table>
)
