import React from "react";
import { render, screen } from "../../test-utils";
import "@testing-library/jest-dom"
import PartnerPage from "@/pages/partners";
import "@testing-library/jest-dom";
import {useSession} from "next-auth/react";
jest.mock("next-auth/react");

describe('first test', () => {
    let fallbackData = []
    afterEach(() => {
        fallbackData = []
    });
    it('should render properly', () => {
        (useSession as jest.Mock).mockReturnValue({user: {email: '79836993884@ya.ru', id: 1, accessLevel: 4}})
        render(<PartnerPage fallbackData={fallbackData}/>)
        const header = screen.getByText(/ara/i)
        const headerText = 'ara'
        expect(header).toHaveTextContent(headerText)
    })
})