import { ProjectItemProps } from "@/types/projects.types"
import { FinansesList } from "../finances-list"


const ProjectFinance = ({ data }: { data: ProjectItemProps }) => {

    return (
        <div>
            <FinansesList incomes={data.incomes} expenses={data.expenses} />
        </div>
    )
}

export default ProjectFinance