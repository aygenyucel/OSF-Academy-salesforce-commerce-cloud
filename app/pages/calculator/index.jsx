import React from "react";
import { 
    Box,
    Button,
    Container, 
    Heading, 
    NumberDecrementStepper, 
    NumberIncrementStepper, 
    NumberInput, 
    NumberInputField, 
    NumberInputStepper, 
    Select
} from '@chakra-ui/react';
import { useState } from "react";
import { useEffect } from "react";

const Calculator = () => {

    const [result, setResult] = useState(null)
    const [inputFirst, setInputFirst] = useState(5)
    const [inputSecond, setInputSecond] = useState(5)
    const [operation, setOperation] = useState("+")

    const handleChangeInputFirst = (e) => {
        setInputFirst(Number(e))
    }

    const handleChangeInputSecond = (e) => {
        setInputSecond(Number(e))
    }

    const handleChangeOperations = (e) => {
        setOperation(e.target.value)
    }

    const clearCalculator = () => {
        setInputFirst(5)
        setInputSecond(5)
        setOperation("+")
    }

    const calculateResult = (firstNum, secondNum, operator) => {
        switch (operator) {
            case "+":
                return firstNum + secondNum
            case "-":
                return firstNum - secondNum
            case "/":
                return firstNum / secondNum
            case "*":
                return firstNum * secondNum
            default:
                return "invalid arguments"
        }
    } 

    useEffect(() => {
        const newResult = calculateResult(inputFirst, inputSecond, operation)
        setResult(newResult)
    }, [inputFirst, inputSecond, operation])

    return (
        <>
            <Container>
                <Box display="flex" flexDirection="column" alignItems="center" >
                    <Box className="heading" mt={5}>
                        <Heading as="h1">Calculator</Heading>
                    </Box>
                    <Box className="calculator" display="flex" mt={5}>
                        <Box className="input-first" mr={3}>
                            <NumberInput defaultValue={5} value={inputFirst} onChange={handleChangeInputFirst}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Box>
                        <Box className="input-second" mr={3}>
                            <NumberInput defaultValue={5} value={inputSecond} onChange={handleChangeInputSecond}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Box>
                        <Box className="operations" mr={3}>
                            <Select defaultValue={"+"} onChange={handleChangeOperations} value={operation}>
                                <option value='+'>+</option>
                                <option value='-'>-</option>
                                <option value='*'>*</option>
                                <option value='/'>/</option>
                            </Select>
                        </Box>
                        <Box className="clear-btn">
                            <Button onClick={clearCalculator}>Clear</Button>
                        </Box>
                    </Box>
                    <Box className="result">
                        <Heading as="h3">{result}</Heading>
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default Calculator;