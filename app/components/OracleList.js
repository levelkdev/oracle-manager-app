import React from 'react'
import {
  IdentityBadge,
  Table,
  TableHeader,
  TableRow,
  TableCell
} from '@aragon/ui'

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
          <IdentityBadge entity={address} />
        </TableCell>
      </TableRow>
    ))}
  </Table>
)

export default OracleList
