/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GmailDashboard from "../screen/GmailDashboard";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
// import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));




jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));
const useMediaQueryMock = jest.mocked(useMediaQuery);


global.React = React;

describe("GmailDashboard", () => {
  beforeEach(() => {
    localStorage.setItem(
      "access_token","Hello"
    );
    localStorage.setItem(
      "id_token","Hello ID"
    );
    localStorage.setItem("is_webview", "false");
    

    
  });

  afterEach(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
  });

  test("renders appbar when isWebView is false", () => {
    render(<GmailDashboard />);
    expect(screen.getByTestId("appbar")).toBeInTheDocument();
  });

  test("opens and closes the drawer", async () => {
    useMediaQueryMock.mockReturnValue(true);
    render(<GmailDashboard />);
    expect(useMediaQueryMock).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("menu-button"));
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("All-Email"));
    await waitFor(() =>
      expect(screen.queryByTestId("drawer")).not.toBeInTheDocument()
    );
  });

  test("opens send email modal", () => {
    render(<GmailDashboard />);
    fireEvent.click(screen.getByTestId("send-email-button"));
    expect(screen.getByTestId("send-modal")).toBeInTheDocument();
  });

  test("navigates to another page when clicking on Gmail Dashboard", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); 
    render(<GmailDashboard />);
    fireEvent.click(screen.getByTestId("dashboard-title"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  test("opens send email modal and fills out the form", async () => {
    render(<GmailDashboard />);
    fireEvent.click(screen.getByTestId("send-email-button"));
    expect(screen.getByTestId("send-modal")).toBeInTheDocument();

    const recipientInput = screen.getByLabelText("To");
    const subjectInput = screen.getByLabelText("Subject");
    const bodyInput = screen.getByLabelText("Body");

    fireEvent.change(recipientInput, { target: { value: "test@example.com" } });
    fireEvent.change(subjectInput, { target: { value: "Test Subject" } });
    fireEvent.change(bodyInput, { target: { value: "This is a test email body." } });

    expect(recipientInput.value).toBe("test@example.com");
    expect(subjectInput.value).toBe("Test Subject");
    expect(bodyInput.value).toBe("This is a test email body.");
  });
  

  test("fetchEmails sets emails and loading state correctly", async () => {
    const mockEmails = [
      { id: 1, title: "guptaharsh1378@gmail.com", subject: "harsh1", body: "harsh11\n", labels: ["UNREAD", "SENT", "INBOX"] },
      { id: 2, title: "guptaharsh137@gmail.com", subject: "harsh2", body: "harsh12\n", labels: ["UNREAD", "SENT", "INBOX"] },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ emails: mockEmails }),
      })
    );

    render(<GmailDashboard />);
    expect(global.fetch).toHaveBeenCalledWith("http://10.24.211.62:3002/api/read-email", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer Hello`,
      },
    });


    
    
     const emailItems = await screen.findAllByTestId("email-item");
     expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
     expect(emailItems.length).toBe(mockEmails.length);
     

    global.fetch.mockRestore();
  });

  test("fetchEmails handles errors and sets loading state correctly", async () => {
    global.fetch = jest.fn(() => Promise.reject("API is down"));

    render(<GmailDashboard />);
    expect(global.fetch).toHaveBeenCalledWith("http://10.24.211.62:3002/api/read-email", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer Hello`,
      },
    });

    await waitFor(() => expect(screen.queryByText("guptaharsh1378@gmail.com")).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText("guptaharsh137@gmail.com")).not.toBeInTheDocument());

    global.fetch.mockRestore();
  });

  test("opens modal, fills email details, and sends email successfully", async () => {
    render(<GmailDashboard />);
    // Open the "Send Email" modal
    fireEvent.click(screen.getByText("Send Email")); // Assuming a button exists
    // Ensure modal appears
    expect(screen.getByTestId("send-modal")).toBeInTheDocument();
    // Fill in email details (query the actual input inside TextField)
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "recipient@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByLabelText("Body"), {
      target: { value: "This is a test email body." },
    });
    // Mock API response for successful email send
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "Email sent successfully!" }),
    });
    // Click send button
    fireEvent.click(screen.getByTestId("send-email"));
    // Ensure API was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("http://10.24.211.62:3002/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer Hello",
        },
        body: JSON.stringify({
          to: "recipient@example.com",
          subject: "Test Subject",
          body: "This is a test email body.",
        }),
      });
    });
    // Ensure modal closes after successful send
    await waitFor(() => {
      expect(screen.queryByTestId("send-modal")).not.toBeInTheDocument();
    });
  });  
  });



  
  


