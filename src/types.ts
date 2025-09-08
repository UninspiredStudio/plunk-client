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

export interface TrackEventReq<Data extends Record<string, string>> {
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

export interface TrackEventResParsed extends Omit<TrackEventRes, "timestamp"> {
  timestamp: Date;
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

export interface SendEmailResParsed extends Omit<SendEmailRes, "timestamp"> {
  timestamp: Date;
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

export interface CreateCampaignResParsed
  extends Omit<CreateCampaignRes, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
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

export interface UpdateCampaignResParsed
  extends Omit<UpdateCampaignRes, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
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

export interface DeleteCampaignResParsed
  extends Omit<DeleteCampaignRes, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
}

export interface Action {}

export interface Event {
  id: string;
  name: string;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventParsed extends Omit<Event, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
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

export interface TriggerParsed
  extends Omit<Trigger, "createdAt" | "updatedAt" | "event"> {
  createdAt: Date;
  updatedAt: Date;
  event: EventParsed;
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

export interface ContactEmailParsed
  extends Omit<ContactEmail, "createdAt" | "updatedAt"> {
  createdAt: Date;
  updatedAt: Date;
}

export interface GetContactByIdRes {
  id: string;
  emaiL: string;
  subscribed: boolean;
  data: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  triggers: Trigger[];
  emails: ContactEmail[];
}

export interface GetContactByIdResParsed<Data extends Record<string, string>>
  extends Omit<
    GetContactByIdRes,
    "createdAt" | "updatedAt" | "triggers" | "emails" | "data"
  > {
  createdAt: Date;
  updatedAt: Date;
  triggers: TriggerParsed[];
  emails: ContactEmailParsed[];
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

export interface GetAllContactsContactParsed<
  Data extends Record<string, string>
> extends Omit<GetAllContactsContact, "createdAt" | "updatedAt" | "data"> {
  createdAt: Date;
  updatedAt: Date;
  data: Data;
}

export type GetAllContactsRes = GetAllContactsContact[];

export type GetAllContactsResParsed<Data extends Record<string, string>> =
  GetAllContactsContactParsed<Data>[];

export interface GetNumberOfContactsRes {
  count: number;
}

export interface CreateContactReq<Data extends Record<string, string>> {
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

export interface CreateContactResParsed<Data extends Record<string, string>>
  extends Omit<CreateContactRes, "createdAt" | "updatedAt" | "data"> {
  data: Data;
  createdAt: Date;
  updatedAt: Date;
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

export type UpdateContactReq<Data extends Record<string, string>> = (
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

export interface UpdateContactResParsed<Data extends Record<string, string>>
  extends Omit<UpdateContactRes, "createdAt" | "updatedAt" | "data"> {
  createdAt: Date;
  updatedAt: Date;
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

export interface DeleteContactResParsed<Data extends Record<string, string>>
  extends Omit<DeleteContactRes, "createdAt" | "updatedAt" | "data"> {
  createdAt: Date;
  updatedAt: Date;
  data: Data;
}
