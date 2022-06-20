import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";

export function LayoutNav()
{
    const router = useRouter();

    function GetNavLink(path: string, label: string, icon?: string)
    {
        const active =
            (path == "/" && router.pathname == "/") ||
            (path != "/" && router.pathname.startsWith(path));

        return <Nav.Link active={active} href={path}>
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
                        {GetNavLink("/users", "User Management", "people")}
                        <Nav.Link href="#other">
                            <i className="bi bi-images me-1"></i>
                            Images
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/api/auth/signout">Sign Out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}