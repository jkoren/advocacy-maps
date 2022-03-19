import React, { useState } from "react"
import { useRouter } from "next/router"
import { Table, Container, Button, Spinner, Row, Form } from "react-bootstrap"
import { useBills } from "../db"
import * as links from "../../components/links.tsx"
import { useMember } from "../db"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import Testimonies from "../Testimonies/Testimonies"

const SearchBar = ({ billsToShow, setBillsToShow, setBillId }) => (
  <Form className="col-lg-5 mx-auto">
    <Form.Group>
      <Row>
        <Form.Control
          type="text"
          placeholder="Search by bill # "
          onChange={e => {
            setBillsToShow(e.target.value)
            // setBillId({ billId: "H1000" })
            // react_devtools_backend.js:3973 Error in useBills FirebaseError: Order by clause cannot contain a field with an equality filter id
          }}
        />
      </Row>
      <Row className="mt-2">
        <Button variant="primary">Search</Button>
      </Row>
    </Form.Group>
  </Form>
)
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
        - {loading ? "" : member.Branch} - {loading ? "" : member.District} -{" "}
        {loading ? "" : member.Party}
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
        <td>{bill.BillNumber}</td>
        <td>{bill.Title}</td>
        <td>{SponsorComponent}</td>
        <td>{fullBill.city}</td>
        <td>{numCoSponsors}</td>
        <td>{fullBill.nextHearingAt?.toDate().toLocaleDateString()}</td>
        {/* does fullBill have a HearingNumber? If so, we can link to the hearing -
        for example: https://malegislature.gov/Events/Hearings/Detail/4200 */}
        <td>{fullBill.testimonyCount}</td>
        <td>
          {fullBill.latestTestimonyAt &&
            fullBill.latestTestimonyAt.toDate().toLocaleDateString()}
        </td>
        <td>{committeeCell}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => router.push(`/bill?id=${bill.BillNumber}`)}
          >
            View Bill
          </Button>
        </td>
      </tr>
    )
  }
}

const BillRows = ({ bills }) => {
  return bills.map((bill, index) => {
    return <BillRow bill={bill} key={index} />
  })
}

const ViewBills = () => {
  const [billsToShow, setBillsToShow] = useState("")

  const {
    bills,
    setSort,
    loading,
    nextPage,
    previousPage,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    setBillId
  } = useBills()

  // const [filterBy, setFilterBy] = useState(null)
  // const filterByMessage =
  //   filterBy == "leadSponsor"
  //     ? "Choose Lead Sponsor.."
  //     : "Choose Lead Sponsor District.."

  return (
    <Container>
      <SearchBar
        billsToShow={billsToShow}
        setBillsToShow={setBillsToShow}
        setBillId={setBillId}
      />
      <div className="row mt-2">
        <div className="col-md-2">
          <select
            className="form-control"
            onChange={e => {
              const option = e.target.value
              if (option !== "DEFAULT") setSort(option)
            }}
          >
            <option value="DEFAULT">Sort bills by..</option>
            <option value="id">Bill #</option>
            <option value="cosponsorCount"># CoSponsors</option>
            <option value="testimonyCount"># Testimony</option>
            <option value="hearingDate">Next Hearing Date</option>
            <option value="latestTestimony">Most recent testimony</option>
          </select>
        </div>
        {/* <div className="col-md-2">
          <select
            className="form-control"
            onChange={e => {
              const option = e.target.value
              setFilterBy(option)
            }}
          >
            <option value="DEFAULT">Filter bills by..</option>
            <option value="leadSponsor">Lead Sponsor</option>
            <option value="leadSponsorDistrict">Lead Sponsor District</option>
          </select>
        </div>

        {filterBy && filterBy != "DEFAULT" && (
          <div className="col-md-4">
            <select
              className="form-control"
              onChange={e => {
                const option = e.target.value
                // if (option !== "DEFAULT") setSort(option)
              }}
            >
              <option value="DEFAULT">{filterByMessage}</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Doe</option>
              <option value="jim">Jim Doe</option>
            </select>
          </div>
        )} */}
      </div>
      {/* something about the table is causing a problem on mobile */}
      <Table className="mt-2" striped bordered hover>
        <thead>
          <tr>
            <th>Bill #</th>
            <th>Bill Name</th>
            <th>Lead Sponsor</th>
            <th>City</th>
            <th># CoSponsors</th>
            <th>Hearing Scheduled</th>
            <th># Testimony</th>
            <th>Most Recent Testimony</th>
            <th>Current Committee</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{bills && <BillRows bills={bills} />}</tbody>
      </Table>
      <Row>{loading && <Spinner animation="border" className="mx-auto" />}</Row>
      <div className="d-flex justify-content-center mb-3">
        <Button
          variant="primary"
          style={{ marginRight: 15 }}
          onClick={previousPage}
          disabled={!hasPreviousPage}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
        <span>Page {currentPage}</span>
        <Button
          variant="primary"
          style={{ marginLeft: 15 }}
          onClick={nextPage}
          disabled={!hasNextPage}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
      </div>
    </Container>
  )
}

export default ViewBills
