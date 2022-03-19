import React from "react"
import { Row, Spinner } from "react-bootstrap"
import BillTestimonies from "../BillTestimonies/BillTestimonies"
import AddTestimony from "../AddTestimony/AddTestimony"
import BillHistory from "../BillHistory/BillHistory"
import BillCosponsors from "../BillCosponsors/BillCosponsors"
import BillStatus from "../BillStatus/BillStatus"
import BillReadMore from "../BillReadMore/BillReadMore"
import { useBill } from "../db"

const ViewBillPage = props => {
  const { loading, result: fullBill } = useBill(props.billId)

  const bill = fullBill?.content
  const committeeName = fullBill?.currentCommittee?.name
  const committeeChairEmail = fullBill?.currentCommittee?.committeeChairEmail

  return loading ? (
    <Row>
      <Spinner animation="border" className="mx-auto" />
    </Row>
  ) : (
    <>
      <Row>
        <div className=" d-flex justify-content-center">
          <BillCosponsors bill={bill} />
          <BillStatus bill={bill} />
        </div>
      </Row>
      <div className="text-center">
        <h4>
          {bill
            ? bill.BillNumber + "  General Court: " + bill.GeneralCourtNumber
            : ""}
        </h4>
        <h4>
          {committeeName
            ? "Current Committee: " + committeeName
            : "No Current Committee"}
        </h4>
        <h4>{bill ? bill.Title : ""}</h4>
        <h5>{bill ? bill.Pinslip : ""}</h5>
      </div>
      <div>
        {bill && bill.DocumentText != null ? (
          <>
            <span style={{ whiteSpace: "pre-wrap" }}>
              {bill.DocumentText.substring(0, 700) + "..."}
            </span>
            {bill.DocumentText.length > 700 ? (
              <BillReadMore bill={bill} />
            ) : null}
          </>
        ) : (
          ""
        )}
      </div>
      <h1>Published Testimony</h1>
      <BillTestimonies bill={bill} />
      <AddTestimony
        bill={bill}
        committeeName={committeeName}
        committeeChairEmail={committeeChairEmail}
      />
    </>
  )
}

export default ViewBillPage
