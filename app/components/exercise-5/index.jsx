import React, {useState} from 'react'
import {
    Box,
    Stack,
    Container,
    Radio, 
    RadioGroup
} from '@chakra-ui/react'

const StateValue = () => {
    const [value, setValue] = useState(null)

    const changeStateValue = (event) => {
        setValue(event)
    }

    return ( <>
                <Container>
                    <Box>
                        {value 
                        ? value
                        : "Change me"}
                    </Box>
                    <Box>
                        <RadioGroup onChange={changeStateValue} value={value}>
                            <Stack direction='row'>
                                <Radio value='1' >First</Radio>
                                <Radio value='2' >Second</Radio>
                                <Radio value='3' >Third</Radio>
                            </Stack>
                        </RadioGroup>
                    </Box>
                </Container>
            </>
    )

  }

  export default StateValue;