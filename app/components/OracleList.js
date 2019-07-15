import React from 'react'
import { Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'

const OracleList = ({ oracles }) => (
  <Table
    header={
      <TableRow>
        <TableHeader title="Address" />
      </TableRow>
    }
  >
    {oracles.map(({ address }) => (
      <TableRow key={address}>
        <TableCell>
          <Text>{address}</Text>
        </TableCell>
      </TableRow>
    ))}
  </Table>
)

export default OracleList
