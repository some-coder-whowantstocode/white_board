import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Processing from './processing';
import { PROCESSES } from '../styles/Processes';

const Processings = () => {
    const INTERNAL_PROCESSES = useSelector(state=>state.process.internalProcesses);
    const EXTERNAL_PROCESSES = useSelector(state=>state.process.externalProcesses);

    useEffect(()=>{
        console.log(INTERNAL_PROCESSES,EXTERNAL_PROCESSES)
    },[INTERNAL_PROCESSES, EXTERNAL_PROCESSES])

return (
    <PROCESSES>
        {
        INTERNAL_PROCESSES  && <Processing info={INTERNAL_PROCESSES}/>
        }
        {
        EXTERNAL_PROCESSES  && <Processing info={EXTERNAL_PROCESSES}/>
        }
    </PROCESSES>
)
}

export default Processings
