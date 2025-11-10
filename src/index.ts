import type {
  Attachment,
  ContactEmail,
  ContactEmailParsed,
  CreateCampaignReq,
  CreateCampaignRes,
  CreateCampaignResParsed,
  CreateContactReq,
  CreateContactRes,
  CreateContactResParsed,
  DeleteCampaignReq,
  DeleteCampaignRes,
  DeleteCampaignResParsed,
  DeleteContactReq,
  DeleteContactRes,
  DeleteContactResParsed,
  Event,
  EventParsed,
  GetAllContactsRes,
  GetAllContactsResParsed,
  GetContactByIdRes,
  GetContactByIdResParsed,
  GetNumberOfContactsRes,
  SendCampaignReq,
  SendCampaignRes,
  SendEmailReq,
  SendEmailReqParsed,
  SendEmailRes,
  SendEmailResParsed,
  SubscribeContactReq,
  SubscribeContactRes,
  TrackEventReq,
  TrackEventRes,
  TrackEventResParsed,
  Trigger,
  TriggerParsed,
  UnsubscribeContactReq,
  UnsubscribeContactRes,
  UpdateCampaignReq,
  UpdateCampaignRes,
  UpdateCampaignResParsed,
  UpdateContactReq,
  UpdateContactRes,
  UpdateContactResParsed,
} from "./types";

export class PlunkApiClient {
  #baseUrl: string;
  #apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.#baseUrl = baseUrl;
    this.#apiKey = apiKey;
  }

  #fetch = async <Response, Body = any>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: Body
  ) => {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.#apiKey}`);
    if (body) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(new URL(endpoint, this.#baseUrl), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return (await res.json()) as Response;
  };

  #fileToBase64 = async (file: File) => {
    return file
      .arrayBuffer()
      .then((buffer) => Buffer.from(buffer).toString("base64"));
  };

  #parseAttachments = async (files: File[]) => {
    const attachments: Attachment[] = [];

    for (const file of files) {
      const attachment: Attachment = {
        filename: file.name,
        content: await this.#fileToBase64(file),
        contentType: file.type,
      };
      attachments.push(attachment);
    }

    return attachments;
  };

  #parseEvent = (event: Event): EventParsed => {
    const createdAtNum = Date.parse(event.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(event.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);

    return { ...event, createdAt, updatedAt };
  };

  #parseTrigger = (trigger: Trigger): TriggerParsed => {
    const createdAtNum = Date.parse(trigger.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(trigger.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);

    return {
      ...trigger,
      createdAt,
      updatedAt,
      event: this.#parseEvent(trigger.event),
    };
  };

  #parseContactEmail = (contactEmail: ContactEmail): ContactEmailParsed => {
    const createdAtNum = Date.parse(contactEmail.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(contactEmail.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);

    return { ...contactEmail, createdAt, updatedAt };
  };

  trackEvent = async <Data extends Record<string, string>>(
    req: TrackEventReq<Data>
  ): Promise<TrackEventResParsed> => {
    const data = await this.#fetch<TrackEventRes, TrackEventReq<Data>>(
      "/v1/track",
      "POST",
      req
    );
    const timestampNum = Date.parse(data.timestamp);
    if (isNaN(timestampNum)) throw new Error("timestamp could not be parsed");
    const timestamp = new Date(timestampNum);
    return { ...data, timestamp };
  };

  sendEmail = async (req: SendEmailReq): Promise<SendEmailResParsed> => {
    const data = await this.#fetch<SendEmailRes, SendEmailReqParsed>(
      "/v1/send",
      "POST",
      {
        ...req,
        attachments: req.attachments
          ? await this.#parseAttachments(req.attachments)
          : undefined,
      }
    );
    const timestampNum = Date.parse(data.timestamp);
    if (isNaN(timestampNum)) throw new Error("timestamp could not be parsed");
    const timestamp = new Date(timestampNum);
    return { ...data, timestamp };
  };

  sendCampaign = async (
    id: SendCampaignReq["id"],
    options?: Omit<SendCampaignReq, "id">
  ): Promise<void> => {
    await this.#fetch<SendCampaignRes, SendCampaignReq>(
      `/v1/campaigns/send`,
      "POST",
      {
        id,
        live: options?.live ?? false,
        delay: options?.delay ?? 0,
      }
    );
  };

  createCampaign = async (
    req: CreateCampaignReq
  ): Promise<CreateCampaignResParsed> => {
    const data = await this.#fetch<CreateCampaignRes, CreateCampaignReq>(
      "/v1/campaigns",
      "POST",
      req
    );
    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);
    return { ...data, createdAt, updatedAt };
  };

  updateCampaign = async (
    id: UpdateCampaignReq["id"],
    body: Omit<UpdateCampaignReq, "id">
  ): Promise<UpdateCampaignResParsed> => {
    const data = await this.#fetch<UpdateCampaignRes, UpdateCampaignReq>(
      `/v1/campaigns`,
      "PUT",
      {
        id,
        ...body,
      }
    );
    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);
    return { ...data, createdAt, updatedAt };
  };

  deleteCampaign = async (
    id: DeleteCampaignReq["id"]
  ): Promise<DeleteCampaignResParsed> => {
    const data = await this.#fetch<DeleteCampaignRes, DeleteCampaignReq>(
      `/v1/campaigns/${id}`,
      "DELETE",
      { id }
    );
    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);
    return { ...data, createdAt, updatedAt };
  };

  getContactById = async <Data extends Record<string, string>>(
    id: string
  ): Promise<GetContactByIdResParsed<Data>> => {
    const data = await this.#fetch<GetContactByIdRes>(
      `/v1/contacts/${id}`,
      "GET"
    );
    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);
    return {
      ...data,
      createdAt,
      updatedAt,
      data: JSON.parse(data.data),
      triggers: data.triggers.map(this.#parseTrigger),
      emails: data.emails.map(this.#parseContactEmail),
    };
  };

  getAllContacts = async <Data extends Record<string, string>>(): Promise<
    GetAllContactsResParsed<Data>
  > => {
    const data = await this.#fetch<GetAllContactsRes>("/v1/contacts", "GET");
    return data.map((contact) => {
      const createdAtNum = Date.parse(contact.createdAt);
      if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
      const createdAt = new Date(createdAtNum);

      const updatedAtNum = Date.parse(contact.updatedAt);
      if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
      const updatedAt = new Date(updatedAtNum);

      return {
        ...contact,
        createdAt,
        updatedAt,
        data: JSON.parse(contact.data) as Data,
      };
    });
  };

  getNumberOfContacts = async (): Promise<GetNumberOfContactsRes> => {
    const data = await this.#fetch<GetNumberOfContactsRes>(
      "/v1/contacts/count",
      "GET"
    );
    return data;
  };

  createContact = async <
    Data extends Record<string, string> = Record<string, string>,
  >(
    req: CreateContactReq<Data>
  ): Promise<CreateContactResParsed<Data>> => {
    const data = await this.#fetch<CreateContactRes>(
      "/v1/contacts",
      "POST",
      req
    );
    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);

    return {
      ...data,
      createdAt,
      updatedAt,
      data: JSON.parse(data.data) as Data,
    };
  };

  subscribeContact = async (
    req: SubscribeContactReq
  ): Promise<SubscribeContactRes> => {
    const data = await this.#fetch<SubscribeContactRes>(
      "/v1/contacts/subscribe",
      "POST",
      req
    );
    return data;
  };

  unsubscribeContact = async (
    req: UnsubscribeContactReq
  ): Promise<UnsubscribeContactRes> => {
    const data = await this.#fetch<UnsubscribeContactRes>(
      "/v1/contacts/unsubscribe",
      "POST",
      req
    );
    return data;
  };

  updateContact = async <
    Data extends Record<string, string> = Record<string, string>,
  >(
    req: UpdateContactReq<Data>
  ): Promise<UpdateContactResParsed<Data>> => {
    const data = await this.#fetch<UpdateContactRes>(
      "/v1/contacts",
      "PUT",
      req
    );
    const createdAtNum = Date.parse(data.createdAt);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAt = new Date(updatedAtNum);

    return {
      ...data,
      createdAt,
      updatedAt,
      data: JSON.parse(data.data) as Data,
    };
  };

  deleteContact = async <
    Data extends Record<string, string> = Record<string, string>,
  >(
    req: DeleteContactReq
  ): Promise<DeleteContactResParsed<Data>> => {
    const data = await this.#fetch<DeleteContactRes>(
      "/v1/contacts",
      "DELETE",
      req
    );

    const createdAtNum = Date.parse(data.createdAt);
    if (isNaN(createdAtNum)) throw new Error("createdAt could not be parsed");
    const createdAt = new Date(createdAtNum);
    const updatedAtNum = Date.parse(data.updatedAt);
    if (isNaN(updatedAtNum)) throw new Error("updatedAt could not be parsed");
    const updatedAt = new Date(updatedAtNum);

    return {
      ...data,
      createdAt,
      updatedAt,
      data: JSON.parse(data.data) as Data,
    };
  };
}

export default PlunkApiClient;

export type * from "./types";
