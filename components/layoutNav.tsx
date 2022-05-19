import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { signOut } from 'next-auth/react'
import { useRouter } from "next/router";

export function LayoutNav()
{
    const router = useRouter();

    function GetNavLink(path: string, label: string, icon?: string)
    {
        return <Nav.Link active={router.pathname == path} href={path}>
            {icon && <i className={`bi bi-${icon} me-1`}></i>}
            {label}
        </Nav.Link>
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand className="text-info" href="/">{process.env.NEXT_PUBLIC_SITE_NAME}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {GetNavLink("/", "Dashboard", "activity")}
                        {GetNavLink("/projects", "Projects", "collection")}
                        {GetNavLink("/posts", "Posts", "card-text")}
                        <Nav.Link href="#other">
                            <i className="bi bi-images me-1"></i>
                            Images
                        </Nav.Link>
                        {/*
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> 
                        */}
                    </Nav>
                    <Nav>
                        <Nav.Link href={undefined} onClick={() => signOut()}>Sign Out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}