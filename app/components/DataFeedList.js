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
    {dataFeeds.map(({ dataFeedAddress , currentResult, lastUpdated }) => (
      <TableRow key={dataFeedAddress }>
        <TableCell>
          <IdentityBadge entity={dataFeedAddress } />
        </TableCell>
        <TableCell>
          <ContextMenu>
            <ContextMenuItem onClick={handleRemove.bind(this, { dataFeedAddress })}>Remove</ContextMenuItem>
            <ContextMenuItem onClick={handleUpdate.bind(this, { dataFeedAddress  })}>Update Price</ContextMenuItem>
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
