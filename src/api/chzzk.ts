interface SuccessResType<T = any> {
  code: 200;
  message: null;
  content: T;
}

export interface FailedResType {
  code: number;
  message: string;
}

interface GetReqWithClientProps {
  endPointUrl: string;
  params?: string;
}

export const getReqWithClient = async <T>({
  endPointUrl,
  params = "",
}: GetReqWithClientProps): Promise<SuccessResType<T> | FailedResType> => {
  try {
    const finalUrl = `https://openapi.chzzk.naver.com${endPointUrl}?${params}`;
    const response = await fetch(finalUrl, {
      method: "GET",
      headers: {
        "Client-Id": process.env.CHZZK_CLIENT_ID!,
        "Client-Secret": process.env.CHZZK_CLIENT_SECRET!,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data as SuccessResType<T>;
  } catch (e) {
    const formattedError: FailedResType = {
      code: 500,
      message: "API 요청 중 오류 발생",
    };
    return formattedError;
  }
};

interface Pagination {
  next: string;
}

export interface LiveData {
  liveId: number;
  liveTitle: string;
  liveThumbnailImageUrl: string;
  concurrentUserCount: string;
  openDate: string;
  adult: boolean;
  tags: string[];
  categoryType: string;
  liveCategory: string;
  liveCategoryValue: string;
  channelId: string;
  channelName: string;
  channelImageUrl: string;
}

export const getLive = async (liveCategory: string) => {
  const endPointUrl = "/open/v1/lives";

  try {
    let response = await getReqWithClient<{
      page: Pagination;
      data: LiveData[];
    }>({
      endPointUrl,
    });

    if ("content" in response) {
      response = {
        ...response,
        content: {
          ...response.content,
          data: response.content.data
            .filter((data) => data.liveCategory === liveCategory)
            .map((data) => ({
              ...data,
              liveThumbnailImageUrl: data.liveThumbnailImageUrl.replace(
                "{type}",
                "480"
              ),
            })),
        },
      };

      let i = response.content.data.length;
      let reqCount = 0;
      while (i < 30) {
        if (reqCount > 50) {
          break;
        }
        const params: URLSearchParams = new URLSearchParams({
          next: response.content.page.next,
        });
        const formattedParams = params.toString();
        const additionalRes = await getReqWithClient<{
          page: Pagination;
          data: LiveData[];
        }>({
          endPointUrl,
          params: formattedParams,
        });

        if ("content" in additionalRes) {
          response = {
            ...response,
            content: {
              page: additionalRes.content.page,
              data: [
                ...response.content.data,
                ...additionalRes.content.data
                  .filter((data) => data.liveCategory === liveCategory)
                  .map((data) => ({
                    ...data,
                    liveThumbnailImageUrl: data.liveThumbnailImageUrl.replace(
                      "{type}",
                      "480"
                    ),
                  })),
              ],
            },
          };
          if (!additionalRes.content.page.next) {
            break;
          }
        }

        i = response.content.data.length;
        reqCount++;
      }
    }
    return response;
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "알 수 없는 오류 발생";
    const formattedError: FailedResType = {
      code: 500,
      message: errorMessage,
    };
    return formattedError;
  }
};
