import Head from "next/head"
import React from "react"
import { SignOut, useAuth } from "./auth"
import { Container, Nav, Navbar, NavDropdown, Row, Col } from "react-bootstrap"
import { Wrap } from "./links"

const V2Layout: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <>
      <TopNav />
    </>
  )
}

const TopNav: React.FC = () => {
  const { authenticated } = useAuth()
  return (
    <Navbar>
      <Container>
        <Row>
          <Col>some text for column 1</Col>
          <Col>some text for column 2</Col>
        </Row>
      </Container>
    </Navbar>
  )
}

const AccountNav: React.FC<{ authenticated: boolean }> = ({
  authenticated
}) => {
  return authenticated ? (
    <>
      <NavLink href="/profile">Profile</NavLink>
      <SignOut />
    </>
  ) : (
    <NavLink href="/login">Sign In To Testify</NavLink>
  )
}

const NavLink: React.FC<{ href: string }> = ({ href, children }) => (
  <Wrap href={href}>
    <Nav.Link>{children}</Nav.Link>
  </Wrap>
)

export default V2Layout
