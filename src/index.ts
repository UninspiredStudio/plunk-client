import type {
  Attachment,
  CreateCampaignReq,
  CreateCampaignRes,
  CreateContactReq,
  CreateContactRes,
  CreateContactResParsed,
  DeleteCampaignReq,
  DeleteCampaignRes,
  DeleteContactReq,
  DeleteContactRes,
  DeleteContactResParsed,
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
  SubscribeContactReq,
  SubscribeContactRes,
  TrackEventReq,
  TrackEventRes,
  UnsubscribeContactReq,
  UnsubscribeContactRes,
  UpdateCampaignReq,
  UpdateCampaignRes,
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
    let data;
    if (res.headers.get("Content-Type")?.startsWith("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return data as Response;
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

  trackEvent = async <Data extends Record<string, string>>(
    req: TrackEventReq<Data>
  ): Promise<TrackEventRes> => {
    const data = await this.#fetch<TrackEventRes, TrackEventReq<Data>>(
      "/v1/track",
      "POST",
      req
    );
    return data;
  };

  sendEmail = async (req: SendEmailReq): Promise<SendEmailRes> => {
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
    return data;
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
  ): Promise<CreateCampaignRes> => {
    const data = await this.#fetch<CreateCampaignRes, CreateCampaignReq>(
      "/v1/campaigns",
      "POST",
      req
    );
    return data;
  };

  updateCampaign = async (
    id: UpdateCampaignReq["id"],
    body: Omit<UpdateCampaignReq, "id">
  ): Promise<UpdateCampaignRes> => {
    const data = await this.#fetch<UpdateCampaignRes, UpdateCampaignReq>(
      `/v1/campaigns`,
      "PUT",
      {
        id,
        ...body,
      }
    );
    return data;
  };

  deleteCampaign = async (
    id: DeleteCampaignReq["id"]
  ): Promise<DeleteCampaignRes> => {
    const data = await this.#fetch<DeleteCampaignRes, DeleteCampaignReq>(
      `/v1/campaigns/${id}`,
      "DELETE",
      { id }
    );
    return data;
  };

  getContactById = async <Data extends Record<string, string>>(
    id: string
  ): Promise<GetContactByIdResParsed<Data>> => {
    const data = await this.#fetch<GetContactByIdRes>(
      `/v1/contacts/${id}`,
      "GET"
    );
    return {
      ...data,
      data: JSON.parse(data.data),
    };
  };

  getAllContacts = async <Data extends Record<string, string>>(): Promise<
    GetAllContactsResParsed<Data>
  > => {
    const data = await this.#fetch<GetAllContactsRes>("/v1/contacts", "GET");
    return data.map((contact) => {
      return {
        ...contact,
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

    return {
      ...data,
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

    return {
      ...data,
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

    return {
      ...data,
      data: JSON.parse(data.data) as Data,
    };
  };
}

export default PlunkApiClient;

export type * from "./types";
