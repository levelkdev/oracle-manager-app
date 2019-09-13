import React from 'react'
import styled from 'styled-components'
import {
  IdentityBadge,
  Table,
  TableHeader,
  TableRow,
  Text,
  TableCell,
  ContextMenu,
  ContextMenuItem
} from '@aragon/ui'

const DataFeedList = ({ dataFeeds = [], title, handleRemove, handleUpdate }) => (
  <DataFeedsComponent>
    <Text size='large'>{ title }</Text>
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
      {dataFeeds.map(({ dataFeedAddress, currentResult, lastUpdated }) => (
        <TableRow key={ dataFeedAddress }>
          <TableCell>
            <IdentityBadge entity={ dataFeedAddress } />
          </TableCell>
          <TableCell>
            {actionItems({ handleRemove, handleUpdate, dataFeedAddress })}
          </TableCell>
          <TableCell>
            <div> { currentResult } </div>
          </TableCell>
          <TableCell>
            <div> { lastUpdated } </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  </DataFeedsComponent>
)

const actionItems = ({ handleRemove, handleUpdate, dataFeedAddress }) => (
  <ContextMenu>
    { handleRemove && <ContextMenuItem onClick={handleRemove.bind(this, { dataFeedAddress })}>Remove</ContextMenuItem> }
    { handleUpdate && <ContextMenuItem onClick={handleUpdate.bind(this, { dataFeedAddress  })}>Update Price</ContextMenuItem> }
  </ContextMenu>
)

const DataFeedsComponent = styled('div')`
  margin: 20px;
`


export default DataFeedList
