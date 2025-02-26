/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import GmailDashboard from "../components/GmailDashboard";
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from "@mui/material";
// import { MemoryRouter } from "react-router-dom";


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const useNavigateMock = jest.mocked(useNavigate)

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn()
}));
const useMediaQueryMock = jest.mocked(useMediaQuery)



global.React = React;


describe("GmailDashboard", () => {
  beforeEach(() => {
    localStorage.setItem("access_token", "ya29.a0AeXRPp6VAchYGZ1UWOJnQ4ZvgHpM-ym3QfGPMr0aGk6NCCu9raET1xgSyBTUfMQhnJ5AExfrowFG1HdX0BPPmgtjIRtAY4SATBIIYaiULsXCSB7KJL3-6ymb7WpZot6tL2doaD4gBMHA_fpTQ5BA_M4dmJpy3ZsVV-T8gdrEswaCgYKAeASARISFQHGX2MillxX0KsQZ-telg6Nel5lPw0177");
    localStorage.setItem("id_token", "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2M2Y3YzRjZDI2YTFlYjJiMWIzOWE4OGY0NDM0ZDFmNGQ5YTM2OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDU1MDIwODYwNDk4LW0yMmVxNXI5NnB0NzdtaGhmYjNoYzc2bDk3bGU5cmY3LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA1NTAyMDg2MDQ5OC1tMjJlcTVyOTZwdDc3bWhoZmIzaGM3Nmw5N2xlOXJmNy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjAzODA5NzYzNDg3MDgxNjYyMSIsImVtYWlsIjoiZ3VwdGFoYXJzaDEzN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IlRrUGwtN2lxQVl0VkhpOGFCMTFCQVEiLCJuYW1lIjoiaGFyc2ggZ3VwdGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVh1ZlAtblcwWldZOXc0bWdNR0Z0QWZ5M3I2TUtHc2dWMkQzSVhaVFB4WkV6SndpeVloZz1zOTYtYyIsImdpdmVuX25hbWUiOiJoYXJzaCIsImZhbWlseV9uYW1lIjoiZ3VwdGEiLCJpYXQiOjE3NDA0Nzg2NDksImV4cCI6MTc0MDQ4MjI0OX0.Xr7pdk4wodcUZKmw9xtusA7rKLp9xEQbsaXgpw5SUQuS_5bbklnHUFA7oQhuSRQ8c2rIQ3iDVR1Dk6_9dfYBXpalZ43umgM54-4EscoKeI6g5lFaHpH4vWyFyUtM03XL1Hh8_j3z64xkCA5_HBkY9UiL4WFeUQpKxzsfEJBDIyg33MbX3jDBDeZZE9O1yhn2cGvvL1EixhHnLjYoiL0A3CVDCL93G2LBH7EycCeDC3iHhLh5_cgSOpy_RkZa1LIa7TMAVBQarcwNYs5EEnE19vwKduzWbJg6DQIxt1v2KL8Rv2M5kA3c8GMutsGdyIMLcnpAQB0bgBg31J6eBSmueA");
    localStorage.setItem('is_webview',"false");
    const navigateMock = jest.fn()

  useNavigateMock.mockReturnValue(navigateMock)
  });

  afterEach(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
  });

  test("renders appbar when isWebView is false", () => {
    render(<GmailDashboard />);
    expect(screen.getByTestId("appbar")).toBeInTheDocument();
  });
  
  test("opens and closes the drawer", async() => {

  useMediaQueryMock.mockReturnValue(true)
    render(<GmailDashboard />);
    expect(useMediaQueryMock).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("menu-button"));
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("All-Email"));
    await waitFor(() => expect(screen.queryByTestId("drawer")).not.toBeInTheDocument());

  });


    
  
  
  test("opens send email modal", () => {
    render(<GmailDashboard  />);
    fireEvent.click(screen.getByTestId("send-email-button"));
    expect(screen.getByTestId("send-modal")).toBeInTheDocument();
  });

  test("navigates to another page when clicking on Gmail Dashboard", () => {
    render(<GmailDashboard />);
    fireEvent.click(screen.getByTestId("dashboard-title"));
    expect(useNavigateMock).toHaveBeenCalled();
  });


  
});

