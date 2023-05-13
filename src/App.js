import React from 'react';
import './App.scss';

import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Link, Button } from 'carbon-components-react';
import { Cookie } from '@carbon/icons-react';
import { Theme } from '@carbon/react';

import Cookies from 'js-cookie';

import data from './data.json'

const headers = [
  {
    key: 'id',
    header: 'Name'
  },
  {
    key: 'link',
    header: 'Link'
  },
  {
    key: 'lastPlayed',
    header: 'Last Played'
  }
]

function deleteCookie() {
  Cookies.remove('gamesData');
  window.location.reload();
}

function getHowManyDaysAgo(date) {
  const diffTime = Math.abs(new Date() - new Date(date));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function formatDate(date) {
  const diffDays = getHowManyDaysAgo(date);
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function App() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const gamesData = Cookies.get('gamesData');
    let gamesObj = {};

    if (gamesData) {
      gamesObj = JSON.parse(gamesData);
    }
    const newRows = data.games.map((game) => {
      const lastPlayed = gamesObj[game.id] ? formatDate(gamesObj[game.id]) : 'N/A';
      return ({
        id: game.id,
        link: <Link href={`${game.link}`} target="_blank" onClick={() => {
          const now = new Date();
          gamesObj[game.id] = now;
          Cookies.set('gamesData', JSON.stringify(gamesObj));
          sleep(1).then(() => {
            window.location.reload();
          });
        }}>{game.link}</Link>,
        lastPlayed: lastPlayed,
      })
    });
    setRows(newRows);
  }, []);

  return (
    <Theme theme="g100">
      <div className="App">
        <h1>Daily Games From the Net</h1>
        <Button
          id="delete-cookies-btn"
          kind="ghost"
          iconDescription="Delete Cookies"
          onClick={deleteCookie}
        >
          <Cookie />
        </Button>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </div>
    </Theme>
  );
}

export default App;