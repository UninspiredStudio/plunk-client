export interface Attachment {
  filename: string;
  content: string; // base64 encoded
  contentType: string;
}

export interface EmailObject {
  email: string;
  contact: {
    id: string;
    email: string;
  };
}

export interface TrackEventReq<Data = any> {
  event: string;
  email: string;
  subscribed?: boolean;
  data?: Data;
}

export interface TrackEventRes {
  success: boolean;
  contact: string;
  event: string;
  timestamp: string;
}

export interface SendEmailReq {
  to: string;
  subject: string;
  body: string;
  subscribed?: boolean;
  name?: string;
  from?: string;
  reply?: string;
  headers?: Record<string, string>;
  attachments?: File[];
}

export interface SendEmailReqParsed extends Omit<SendEmailReq, "attachments"> {
  attachments?: Attachment[];
}

export interface SendEmailRes {
  success: boolean;
  emails: EmailObject[];
  timestamp: string;
}

export interface CreateCampaignReq {
  subject: string;
  body: string;
  recipients: string[];
  style: "PLUNK" | "HTML";
}

export interface CreateCampaignRes {
  id: string;
  subject: string;
  body: string;
  status: "DRAFT" | "SENDING";
  delivered: null;
  style: "PLUNK" | "HTML";
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendCampaignReq {
  id: string;
  live?: boolean;
  delay?: number;
}

// TODO: Get type from response
export interface SendCampaignRes {}

export interface UpdateCampaignReq {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  style?: "PLUNK" | "HTML";
}

export interface UpdateCampaignRes {
  id: string;
  subject: string;
  body: string;
  status: "DRAFT" | "SENDING" | "DELIVERED";
  style: "PLUNK" | "HTML";
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteCampaignReq {
  id: string;
}

export interface DeleteCampaignRes {
  id: string;
  subject: string;
  body: string;
  status: "DRAFT" | "SENDING" | "DELIVERED";
  delivered: null;
  style: "PLUNK" | "HTML";
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Action {}

export interface Event {
  id: string;
  name: string;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Trigger {
  id: string;
  contactId: string;
  eventId: string;
  actionId: string | null;
  createdAt: string;
  updatedAt: string;
  event: Event;
  action: Action | null;
}

export interface ContactEmail {
  id: string;
  messageId: string;
  subject: string;
  status: "OPENED" | "BOUNCED" | "COMPLAINT";
  projectId: string;
  actionId: string | null;
  campaignId: string | null;
  contactId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetContactByIdRes {
  id: string;
  email: string;
  subscribed: boolean;
  data: Data;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  triggers: Trigger[];
  emails: ContactEmail[];
}

export interface GetContactByIdResParsed<Data = any>
  extends Omit<GetContactByIdRes, "data"> {
  data: Data;
}

export interface GetAllContactsContact {
  id: string;
  email: string;
  subscribed: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllContactsContactParsed<Data = any>
  extends Omit<GetAllContactsContact, "data"> {
  data: Data;
}

export type GetAllContactsRes = GetAllContactsContact[];

export type GetAllContactsResParsed<Data = any> =
  GetAllContactsContactParsed<Data>[];

export interface GetNumberOfContactsRes {
  count: number;
}

export interface CreateContactReq<Data = any> {
  email: string;
  subscribed: boolean;
  data: Data;
}

export interface CreateContactRes {
  success: boolean;
  id: string;
  email: string;
  subscribed: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactResParsed<Data = any>
  extends Omit<CreateContactRes, "data"> {
  data: Data;
}

export interface SubscribeContactReqId {
  id: string;
}

export interface SubscribeContactReqEmail {
  email: string;
}

export type SubscribeContactReq =
  | SubscribeContactReqId
  | SubscribeContactReqEmail;

export interface SubscribeContactRes {
  success: boolean;
  contact: string;
  subscribed: boolean;
}

export interface UnsubscribeContactReqId {
  id: string;
}

export interface UnsubscribeContactReqEmail {
  email: string;
}

export type UnsubscribeContactReq =
  | UnsubscribeContactReqId
  | UnsubscribeContactReqEmail;

export interface UnsubscribeContactRes {
  success: boolean;
  contact: string;
  subscribed: boolean;
}

export interface UpdateContactReqId {
  id: string;
}

export interface UpdateContactReqEmail {
  email: string;
}

export type UpdateContactReq<Data = any> = (
  | UpdateContactReqId
  | UpdateContactReqEmail
) & {
  subscribed: boolean;
  data: Data;
};

export interface UpdateContactRes {
  success: boolean;
  id: string;
  email: string;
  subscribed: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactResParsed<Data = any>
  extends Omit<UpdateContactRes, "data"> {
  data: Data;
}

export interface DeleteContactReq {
  id: string;
}

export interface DeleteContactRes {
  success: boolean;
  id: string;
  email: string;
  subscribed: boolean;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteContactResParsed<Data = any>
  extends Omit<DeleteContactRes, "data"> {
  data: Data;
}
