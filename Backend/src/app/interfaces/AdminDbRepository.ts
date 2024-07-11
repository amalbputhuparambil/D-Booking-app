import { AdminRepositoryMongodbType } from "../../frameworks/database/repositories/AdminRepositoryMongodb";
import { BannerInterface } from "../../types/adminInterfaces";

export default function adminDbRepository(
  repository: ReturnType<AdminRepositoryMongodbType>
) {
  const banners = async (filter: Record<string, any> = {}) =>
    await repository.banners(filter);

  const allBanners = async () =>
    await repository.allBanners();

  const newBanner = async (bannerData: BannerInterface) =>
    await repository.newBanner(bannerData);

  const updateBanner = async (bannerId: string, isActive: string) =>
    await repository.updateBanner(bannerId, isActive);

  const deleteBanner = async (bannerId: string) =>
    await repository.deleteBanner(bannerId);

  return { banners, newBanner, updateBanner, deleteBanner, allBanners };
}
export type AdminDbRepositoryInterface = typeof adminDbRepository;