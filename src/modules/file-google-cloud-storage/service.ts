import { Logger } from "@medusajs/framework/types";
import {
  AbstractFileProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import {
  FileServiceUploadResult,
  DeleteFileType,
  UploadStreamDescriptorType,
  FileServiceGetUploadStreamResult,
  GetUploadedFileType,
  ProviderUploadFileDTO,
  ProviderFileResultDTO,
  ProviderDeleteFileDTO,
  ProviderGetFileDTO,
} from "@medusajs/types";
import { Storage, Bucket, GetSignedUrlConfig } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import stream, { Readable, PassThrough } from "stream";
import path from "path";
import {
  UploadStreamDescriptorWithPathType,
  UploadedJsonType,
} from "./types/upload-binary";

type InjectedDependencies = {
  logger: Logger;
};

type Options = {
  credentials: {
    client_email: string;
    private_key: string;
  };
  publicBucketName: string;
  privateBucketName: string;
  basePublicUrl: string;
};

class FileGoogleCloudProviderService extends AbstractFileProviderService {
  protected logger_: Logger;
  protected options_: Options;
  static identifier = "file-google-cloud-storage";

  protected publicBucket_: Bucket;
  protected publicBucketName_: string;
  protected basePublicUrl_: string = "";
  protected privateStorage_: Storage;
  protected privateBucketName_: string;

  constructor({ logger }: InjectedDependencies, options: Options) {
    super();

    this.logger_ = logger;
    this.options_ = options;

    //setup storage client
    if (options.credentials) {
      this.privateStorage_ = new Storage({
        credentials: {
          client_email: options.credentials.client_email,
          private_key: options.credentials.private_key,
        },
      });
    } else {
      //Use Application Default credentials
      this.privateStorage_ = new Storage();
    }
    //Setup public bucket name
    this.publicBucketName_ = options.publicBucketName;

    //Setup private bucket name
    this.privateBucketName_ = options.privateBucketName;

    //base public url for get file in internet (e.g. cdn url)
    this.basePublicUrl_ = options.basePublicUrl || "";
  }

  static validateOptions(options: Record<any, any>) {
    if (
      !options.credentials?.client_email ||
      !options.credentials?.private_key ||
      !options.publicBucketName ||
      !options.privateBucketName ||
      !options.basePublicUrl
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "invalid options, required options are missing in the provider's options."
      );
    }
  }

  /**
   * This method is used to transform the Google Cloud URL to a CDN URL. (Only for public bucket)
   * @param googleCloudURL
   * @returns
   */
  transformGoogleCloudURLtoCDN(googleCloudURL: string): string {
    // Define the base URLs
    const googleCloudBaseURL = `https://storage.googleapis.com/${this.publicBucketName_}/`;

    // Extract the file identifier from the Google Cloud URL
    const fileIdentifier = googleCloudURL.replace(googleCloudBaseURL, "");

    // Construct the CDN URL
    const cdnURL = `${this.basePublicUrl_}${fileIdentifier}`;
    return cdnURL;
  }

  async upload(
    fileData: ProviderUploadFileDTO
  ): Promise<ProviderFileResultDTO> {
    // TODO upload file to third-party provider
    // or using custom logic

    console.log({ fileData });

    try {
      //key for use identifier when client get this
      const key = uuidv4();
      // Extracting the file name without the extension
      const fileNameWithoutExtension = path.parse(fileData.filename);
      const destination = `${key}/${fileNameWithoutExtension}/${fileData.filename}`;
      const result = await this.privateStorage_
        .bucket(this.publicBucketName_)
        .upload(fileData.content, {
          destination,
        });
      //get content of file
      const [file] = result;
      const publicUrl = await file.publicUrl();
      const cdnURL = this.transformGoogleCloudURLtoCDN(publicUrl);
      return {
        url: cdnURL,
        key: destination,
      };
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        error?.message || "Upload file to bucket error."
      );
    }
  }

  async delete(file: ProviderDeleteFileDTO): Promise<void> {
    // TODO logic to remove the file from storage
    // Use the `file.fileKey` to delete the file
    // for example:
    console.log({ file });

    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "delete method not implemented"
    );

    // this.client.delete(file.fileKey);
  }

  async getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string> {
    // TODO logic to get the presigned URL
    // Use the `file.fileKey` to delete the file
    // for example:
    // return this.client.getPresignedUrl(fileData.fileKey);

    console.log({ fileData });

    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "getPresignedDownloadUrl method not implemented"
    );
  }
}

export default FileGoogleCloudProviderService;
