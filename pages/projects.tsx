import { InputPasswordOutlined } from "@components/input/inputPasswords";
import { InputSwitch } from "@components/input/inputSwitch";
import { InputText } from "@components/input/inputText";
import { LayoutHead } from "@components/layoutHead";
import { LayoutMain } from "@components/layoutMain";
import { ModalLoading } from "@components/modals/modalLoading";
import { OnModalTextInputResponseEvent } from "@components/modals/modalTextInput";
import { ModalTextInputWithButton } from "@components/modals/modalTextInputWithButton";
import { ProjectControllerCS, ProjectControllerSS } from "@lib/controllers/projectController";
import { NextPageCustom } from "@lib/extentions/appPropsCustom";
import { ProjectModel } from "@lib/models/project/projectModel";
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Button, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { deepCopy } from "@lib/helpers/deepCopy";
import { compareObjectsSame } from "@lib/helpers/comparer";

const Projects: NextPageCustom<PageProps> = (props) =>
{
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [projectsTemp, setProjectsTemp] = useState<ProjectModel[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // useEffect(() =>
    // {
    //     setProjects(deepCopy(props.projects));
    //     setProjectsTemp(deepCopy(props.projects));
    // }, [props.projects])

    const showToast = (success: boolean, message: string) => enqueueSnackbar(
        message,
        {
            variant: success ? "success" : "error",
            anchorOrigin: { horizontal: "right", vertical: "bottom" }
        }
    )

    const projectCreateHandler: OnModalTextInputResponseEvent = async (response, value) =>
    {
        if (response != "accept" || !value) return;

        setIsLoading(true);
        try
        {
            const controller = new ProjectControllerCS();
            const response = await controller.create(value);

            showToast(true, "Project has been added.");

            const projectsCopy = [...projects];
            projectsCopy.push(response);
            setProjects(projectsCopy);

            const projectsTempCopy = [...projectsTemp];
            projectsTempCopy.push(response);
            setProjectsTemp(projectsTempCopy);
        }
        catch (error: any)
        {
            showToast(false, error);
        }
        setIsLoading(false);
    }

    const projectSelectHandler = (index: number | null) =>
    {
        setSelectedIndex(index);
        setProjectsTemp(deepCopy(projects));
    }

    const updateProjectNameHandler = (index: number, projectName: string) =>
    {
        projectsTemp[index].projectName = projectName;
        setProjectsTemp([...projectsTemp]);
    }

    const updateProjectAccessTokenHandler = (index: number, accessToken: string) =>
    {
        projectsTemp[index].accessToken = accessToken;
        setProjectsTemp([...projectsTemp]);
    }

    const updateProjectIsActiveHandler = (index: number, isActive: boolean) =>
    {
        projectsTemp[index].isActive = isActive;
        setProjectsTemp([...projectsTemp]);
    }

    const projectUpdateHandler = async (index: number) =>
    {
        const project = projectsTemp[index];
        setIsLoading(true);
        try
        {
            const controller = new ProjectControllerCS();
            await controller.update(project);
            showToast(true, "Project has been updated.");
            projects[index] = { ...project };
            setProjects([...projects]);
        }
        catch (error: any)
        {
            showToast(false, error);
        }
        setIsLoading(false);
    }

    return (<>
        <LayoutHead title='Projects' />
        <LayoutMain>
            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" >
                    <Typography variant="h4">Projects</Typography>
                    <ModalTextInputWithButton
                        title="New Project"
                        message="Select a name for your new project, all other values will bet auto generated."
                        textLabel="Project Name"
                        onModalRespond={projectCreateHandler}
                        buttonText="New Project"
                        buttonColor="success"
                        buttonVariant="contained"
                    />
                </Stack>

                <Alert severity="info" variant="outlined" >
                    Before deleting a Project, all assigned Post&apos;s must be deassigned or deleted.
                </Alert>

                <Stack>
                    {projects.map((project, i) =>
                        <Accordion
                            key={project.projectID}
                            expanded={i == selectedIndex}
                            onChange={(_, v) => projectSelectHandler(v ? i : null)}
                        >

                            <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                <Typography variant="h6">{project.projectName}</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Stack spacing={4}>
                                    <InputSwitch
                                        color="success"
                                        label={`${projectsTemp[i].isActive ? "Is" : "Not"} Active`}
                                        checked={projectsTemp[i].isActive}
                                        onChange={(value) => updateProjectIsActiveHandler(i, value)}
                                    />
                                    <InputText
                                        label="Project Name"
                                        value={projectsTemp[i].projectName}
                                        onValueChange={(value) => updateProjectNameHandler(i, value)}
                                    />
                                    <InputPasswordOutlined
                                        label="Access Token"
                                        password={projectsTemp[i].accessToken}
                                        onPasswordChange={(value) => updateProjectAccessTokenHandler(i, value)} />
                                </Stack>
                            </AccordionDetails>

                            <AccordionActions>
                                <Stack direction="row" gap={2} paddingRight={1} paddingBottom={1}>
                                    <Button color="warning">Delete</Button>
                                    <Button
                                        color="success" variant="contained"
                                        disabled={compareObjectsSame(projects[i], projectsTemp[i])}
                                        onClick={() => projectUpdateHandler(i)}
                                    >Save</Button>
                                </Stack>
                            </AccordionActions>
                        </Accordion>
                    )}
                </Stack>
            </Stack>
        </LayoutMain>
        <ModalLoading modelOpen={isLoading} title="Please Wait"></ModalLoading>
    </>)

};
export default Projects;

interface PageProps
{
    projects: ProjectModel[]
}

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const controller = new ProjectControllerSS();
    const data = await controller.getAll();
    return {
        props: { projects: data } as PageProps
    }
}