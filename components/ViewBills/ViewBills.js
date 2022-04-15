import { useRouter } from "next/router"
import React from "react"
import { Button, Container, Row, Spinner, Table } from "react-bootstrap"
import * as links from "../../components/links.tsx"
import { useBills, useMember } from "../db"
import { formatBillId, formatTimestamp } from "../formatting"
import { BillSearch } from "../search"
import { PaginationButtons } from "../table"
import BootstrapTable from "react-bootstrap-table-next"
import { ItemSearch } from "../search/search"

const invalidSponsorId = Id => {
  // we will have to learn more about why certain sponsors have invalid ID's
  return ["GOV7"].includes(Id)
}

const BillRow = props => {
  const fullBill = props.bill
  const bill = props.bill.content
  const router = useRouter()
  const { member, loading } = useMember(
    bill.PrimarySponsor ? bill.PrimarySponsor.Id : null
  )
  const sponsorURL =
    bill &&
    bill.PrimarySponsor &&
    bill.PrimarySponsor.Id &&
    !invalidSponsorId(bill.PrimarySponsor.Id)
      ? `https://malegislature.gov/Legislators/Profile/${bill.PrimarySponsor.Id}/Biography`
      : ""
  const numCoSponsors = bill.Cosponsors ? bill.Cosponsors.length : 0

  const SponsorComponent =
    sponsorURL != "" ? (
      <>
        <links.External href={sponsorURL}>
          {bill.PrimarySponsor.Name}
        </links.External>
        - {member?.Branch} - {member?.District}
      </>
    ) : (
      <>{bill.PrimarySponsor ? bill.PrimarySponsor.Name : null}</>
    )

  const committeeCell = fullBill.currentCommittee ? (
    <>
      <links.External
        href={`https://malegislature.gov/Committees/Detail/${fullBill.currentCommittee?.id}/Committees`}
      >
        {fullBill.currentCommittee?.name}
      </links.External>
    </>
  ) : (
    <></>
  )

  if (loading) {
    return null
  } else {
    return (
      <tr>
        <td>
          <Button
            variant="primary"
            onClick={() => router.push(`/bill?id=${bill.BillNumber}`)}
          >
            {formatBillId(bill.BillNumber)}
          </Button>
        </td>
        <td>{bill.Title}</td>
        <td>{SponsorComponent}</td>
        <td>{fullBill.city}</td>
        <td>{numCoSponsors}</td>
        <td>{formatTimestamp(fullBill.nextHearingAt)}</td>
        <td>{fullBill.testimonyCount}</td>
        <td>{formatTimestamp(fullBill.latestTestimonyAt)}</td>
        <td>{committeeCell}</td>
      </tr>
    )
  }
}

const BillRows = ({ bills }) => {
  return bills.map((bill, index) => {
    return <BillRow bill={bill} key={index} />
  })
}

const columns = [
  {
    dataField: "id",
    text: "Bill #",
    sort: true
  },
  {
    dataField: "bill.Title",
    text: "Bill Title",
    sort: true
  },
  {
    dataField: "price",
    text: "Lead Sponsor"
  },
  {
    dataField: "price1",
    text: "City"
  },
  {
    dataField: "cosponsorCount",
    text: "# CoSponsors",
    sort: true
  },
  {
    dataField: "price2",
    text: "Hearing Scheduled"
  },
  {
    dataField: "price3",
    text: "Published Testimony (#)"
  },
  {
    dataField: "price4",
    text: "Most Recent Testimony"
  },
  {
    dataField: "price5",
    text: "Current Committee"
  }
]

const ViewBills = () => {
  const { items, setSort, setFilter, pagination } = useBills()
  const bills = items?.result ? items?.result : []
  // const bills2 = items?.result
  //   ? items.result.map(bill => {
  //       return [
  //         formatBillId(bill.BillNumber),
  //         bill.Title
  //         // SponsorComponent,
  //         // fullBill.city
  //       ]
  //     })
  //   : []

  // console.log(bills2)

  // <td>{bill.Title}</td>
  // <td>{SponsorComponent}</td>
  // <td>{fullBill.city}</td>
  // <td>{numCoSponsors}</td>
  // <td>{formatTimestamp(fullBill.nextHearingAt)}</td>
  // <td>{fullBill.testimonyCount}</td>
  // <td>{formatTimestamp(fullBill.latestTestimonyAt)}</td>
  // <td>{committeeCell}</td>

  // testimonies.map((testimony, index) => {
  //   return <TestimonyRow testimony={testimony} key={index} />
  // })
  return (
    <Container>
      <BillSearch setSort={setSort} setFilter={setFilter} />
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Bill #</th>
            <th>Bill Title</th>
            <th>Lead Sponsor</th>
            <th>City</th>
            <th># CoSponsors</th>
            <th>Hearing Scheduled</th>
            <th>Published Testimony (#)</th>
            <th>Most Recent Testimony</th>
            <th>Current Committee</th>
          </tr>
        </thead>
        <tbody>{items.result && <BillRows bills={items.result} />}</tbody>
      </Table>
      <Row>
        {items.loading && <Spinner animation="border" className="mx-auto" />}
      </Row>
      <PaginationButtons pagination={pagination} />
      <BootstrapTable
        keyField="id"
        data={bills}
        columns={columns}
        responsive
        striped
        bordered
        hover
      />
    </Container>
  )
}

export default ViewBills
