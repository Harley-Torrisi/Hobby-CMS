import { Spinner } from "react-bootstrap";

export function LoadingSkeleton()
{
    return (
        <div className="pt-4 text-center">
            <Spinner animation="grow" role="status" variant="secondary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}