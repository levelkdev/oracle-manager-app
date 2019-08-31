import React from 'react'
import styled from 'styled-components'
import {
  IdentityBadge,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  ContextMenu,
  ContextMenuItem
} from '@aragon/ui'

const DataFeedList = ({ dataFeeds, handleRemove, handleUpdate }) => (
  <Table
    header={
      <TableRow>
        <TableHeader title="Address" />
        <TableHeader title="Actions" />
        <TableHeader title="Current Price" />
        <TableHeader title="Last Updated" />
      </TableRow>
    }
  >
    {dataFeeds.map(({ address, currentResult, lastUpdated }) => (
      <TableRow key={address}>
        <TableCell>
          <IdentityBadge entity={address} />
        </TableCell>
        <TableCell>
          <ContextMenu>
            <ContextMenuItem onClick={handleRemove.bind(this, { address })}>Remove</ContextMenuItem>
            <ContextMenuItem onClick={handleUpdate.bind(this, { address })}>Update Price</ContextMenuItem>
          </ContextMenu>
        </TableCell>
        <TableCell>
          <IdentityBadge entity={currentResult} />
        </TableCell>
        <TableCell>
          <IdentityBadge entity={lastUpdated} />
        </TableCell>
      </TableRow>
    ))}
  </Table>
)

export default DataFeedList
