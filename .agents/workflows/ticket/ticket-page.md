# Mobile Ticket Feature Workflow & Implementation Guide

This workflow document outlines how the **Ticket** feature is designed, structured, and implemented in the `ops-desk-mobile-app` React Native Expo application, serving as a reference for future development.

## 1. Feature Architecture & Key Files

The Ticket feature spans types, APIs, pages, and components in the mobile frontend:

- **Types Definitions**:
  - [types/ticket.ts](../../../types/ticket.ts): Defines ticket types, priorities, statuses, and `TicketModel`, `CreateTicketModel`, and query models.
  - [types/ticket-comment.ts](../../../types/ticket-comment.ts): Defines `TicketCommentModel` (supporting threaded replies), `CreateTicketCommentModel`, and image update models.
  - Exported through the central index in [types/index.ts](../../../types/index.ts).

- **API Clients**:
  - [apis/ticket.ts](../../../apis/ticket.ts): Wrapper for `/ticket` CRUD endpoints using native `fetch` for multipart creation.
  - [apis/ticket-comment.ts](../../../apis/ticket-comment.ts): Wrapper for `/ticket-comment` CRUD and image-set replacement endpoints.

- **Routing & Screens (Expo Router)**:
  - List View: [app/private/ticket/index.tsx](../../../app/private/ticket/index.tsx)
  - Creation Screen: [app/private/ticket/add.tsx](../../../app/private/ticket/add.tsx)
  - Detail & Comments View: [app/private/ticket/\[id\].tsx](../../../app/private/ticket/\[id\].tsx)
  - Image Management: [app/private/ticket/images.tsx](../../../app/private/ticket/images.tsx)

- **Components (Gluestack UI / NativeWind)**:
  - Ticket Form: [components/ticket/TicketForm.tsx](../../../components/ticket/TicketForm.tsx) (Handles ticket input forms, location/assignee selection, and image pickers).
  - Ticket Comment Section: [components/ticket/TicketCommentSection.tsx](../../../components/ticket/TicketCommentSection.tsx) (Displays threaded comment system, replies, image uploads, edit, and delete features).

---

## 2. Key Workflows & Features

### A. Ticket Form & Required Fields
- **Asset Item Selection**: The backend requires at least one asset item (`assetItemIds`) to create a ticket. The form queries `/asset-item` and renders a list of checkboxes or picker items.
- **Image Picker**: Utilizes `expo-image-picker` to select local files.
- **Native Upload**: Uses native `fetch` with `FormData` to bypass Hermes engine bugs with Axios boundary configurations.

### B. Threaded Comments System
The comments system is nested (threaded) up to a depth of 2.
- **Retrieval**: The API returns a nested array where children replies are populated under the `.replies` property of parent comments.
- **Creation & Reply**: Submitting a comment sends a request to `POST /ticket-comment`. If it is a reply, the `parentId` is specified. Multiple images (up to 5) can be uploaded.
- **Content & Image Updates**: 
  - Text updates are submitted via `PATCH /ticket-comment/:id`.
  - Image updates are submitted via `PUT /ticket-comment/:id/images`, passing `keepUrls` (existing image links to keep) and new files to upload.
- **Permissions**: Edit and delete operations are restricted to the owner of the comment. The client decodes the JWT token from AsyncStorage (`LOCAL_KEYS.TOKEN`) to verify the owner ID.

---

## 3. Best Practices for Modifying the Ticket System

1. **Native fetch for Multipart**: When uploading images, compile parameters into `FormData` and submit using native `fetch` (with headers containing Authorization token but NO `Content-Type` header) so React Native Herme sets the correct boundary header.
2. **React Query Invalidation**: After making comment/ticket mutations, remember to invalidate query keys `["get", "ticket"]` and `["get", "tickets"]` so the UI automatically updates with the fresh data.
3. **Thread Recurse Rendering**: Use a nested component structure that recursively renders its own replies to maintain clean recursive styling. Indent replies using left borders and padding (e.g. `pl-5 border-l`).
