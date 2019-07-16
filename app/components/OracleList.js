import React from 'react'
import {
  IdentityBadge,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ContextMenu,
  ContextMenuItem
} from '@aragon/ui'

const OracleList = ({ oracles, handleRemove }) => (
  <Table
    header={
      <TableRow>
        <TableHeader title="Address" />
        <TableHeader title="Actions" />
      </TableRow>
    }
  >
    {oracles.map(({ address }) => (
      <TableRow key={address}>
        <TableCell>
          <IdentityBadge entity={address} />
        </TableCell>
        <TableCell>
          <ContextMenu>
            <ContextMenuItem onClick={handleRemove.bind(this, { address })}>Remove</ContextMenuItem>
          </ContextMenu>
        </TableCell>
      </TableRow>
    ))}
  </Table>
)

export default OracleList
