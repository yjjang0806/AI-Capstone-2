<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSkinStore } from "@/stores/skinStore";
import { useSurveyStore } from "@/stores/surveyStore";
import { uploadImageAPI, submitAnalysisAPI } from "@/api/axios";

const router = useRouter();
const skinStore = useSkinStore();
const surveyStore = useSurveyStore();

const message = ref("피부를 분석하고 있어요...");
const isError = ref(false);

onMounted(async () => {
  if (!skinStore.faceImage) {
    isError.value = true;
    message.value = "얼굴 사진이 없습니다. 다시 촬영해주세요.";
    setTimeout(() => router.replace("/camera"), 1500);
    return;
  }

  try {
    // 1) 이미지 업로드
    const uploadRes = await uploadImageAPI(skinStore.faceImage);
    const imageUrl = uploadRes.data.data.imageUrl;

    // 2) 분석 요청
    const res = await submitAnalysisAPI(imageUrl, surveyStore.answers);
    const data = res.data.data;
    const fusion = data.fusion;

    const mapped = {
      imageUrl: data.imageUrl ?? imageUrl,
      skinMbtiType: fusion.skin_mbti,
      skinType: fusion.skin_type,
      headline: data.headline,
      skinDescription: data.skinDescription,
      whiteListIngredients: data.whiteListIngredients ?? [],
      whiteListRecommendation: data.whiteListRecommendation ?? "",
      blackListIngredients: data.blackListIngredients ?? [],
      indices: fusion.indices,
      visionRaw: fusion.vision_raw ?? {},
      recommendations: (data.recommendations ?? []).map((rec: any) => ({
        productId: rec.product_id ?? rec.productId,
        productName: rec.productName,
        brand: rec.brand,
        salePrice: rec.salePrice,
        averageReviewScore: rec.averageReviewScore,
        totalReviewCount: rec.totalReviewCount,
        category: rec.category,
        imageUrl: rec.image_url ?? rec.imageUrl,
        tags: rec.xaiKeywords ?? [],
      })),
    };

    skinStore.setAnalysisResult(mapped);
    router.replace("/result");
  } catch (e) {
    console.error(e);
    isError.value = true;
    message.value = "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
});
</script>
