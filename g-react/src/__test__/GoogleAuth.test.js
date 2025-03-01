/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../components/Home";
import { useNavigate } from "react-router-dom";

// import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// const useNavigateMock = jest.mocked(useNavigate);





global.React = React;

describe("GmailDashboard", () => {
//   beforeEach(() => {
   
    
//   });
//   afterEach(() => {
//     localStorage.setItem(
//         "access_token","Hello"
//         );
//         localStorage.setItem(
//         "id_token","Hello ID"
//         );
//   });

  test('should Render The Signin Button', () => {
    
  
    render(<Home />);
    expect(screen.getByTestId("SignInButton")).toBeInTheDocument();
    
  })
  test('should Redirect to Dashboard if tokens are present', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); 
    localStorage.setItem(
    "access_token","Hello"
    );
    localStorage.setItem(
    "id_token","Hello ID"
    );
    render(<Home />);
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});
  
  test('should not Redirect to Dashboard if tokens are not present', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); 
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    render(<Home />);
    expect(mockNavigate).not.toHaveBeenCalled();
});

    
 test('should Recive the Auth URL on Clicking SignIn Button', async () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        
        const mockUrl = "http://googleAuthUrl";
        
        global.fetch = jest.fn(() =>
            Promise.resolve({
              json: () => Promise.resolve({ authUrl: mockUrl }),
            })
          );
        delete window.location 
        window.location = { assign: jest.fn() };

        render(<Home />);
        fireEvent.click(screen.getByTestId("SignInButton"));
        console.log(window.location.href);

        await waitFor(() => expect(window.location.href).toBe(mockUrl));
        
        global.fetch.mockRestore();
        });
    





   


  
});