import { BASE_URL } from "@/api/BaseUrl";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
import { usePagination } from "@/hooks/usePagination";
function CardGridRenderer({
  currentItems,
  isLoading,
  error,
  draggedIndex,
  setLocalStatuses,
  localStatuses,
  trans,
  isLoadingStatus,
  handleDefault,
  handleRestore,
  isSettingLoading,
  subdomain,
  handleViewEdit,
  handleDelete,
  handleEnter,
  handlechangeStatus,
  labelLoading,
  isDefaultForMenu,
  offset,
  setDraggedIndex,
  filteredSections,
  setFilteredSections,
}) {
  const truncateDescription = (description, maxLength = 50) => {
    // console.log("Description received:", description);
    if (!description) return "";
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  // const handleToggleActive = (checked, sectionId) => {
  //   setLocalStatuses((prev) => ({
  //     ...prev,
  //     [sectionId]: checked,
  //   }));
  // };
  const getStatus = (section) => {
    // لو المستخدم غيّر السويتش، نستخدم القيمة اللي في localStatuses
    if (section.id in localStatuses) return localStatuses[section.id];
    // وإلا نرجع القيمة الأصلية من الـ API
    return !!section.status;
  };

  const handleDragStart = (e, localIndex) => {
    const actualIndex = offset + localIndex; //  index الحقيقي من filteredSections
    setDraggedIndex(actualIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;
  };
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // نسخ filteredSections لعدم التلاعب بالـ state مباشرة
    const reorderedSections = [...filteredSections];

    // سحب العنصر الذي تم سحبه من مكانه القديم
    const [draggedItem] = reorderedSections.splice(draggedIndex, 1);

    // إدخال العنصر في المكان الجديد
    reorderedSections.splice(dropIndex, 0, draggedItem);

    // تحديث filteredSections في الـ state
    setFilteredSections(reorderedSections);
    setDraggedIndex(null);

    // حساب الترتيب الجديد بناءً على filteredSections
    const arrangement = reorderedSections.map((_, index) => index + 1);

    // إظهار الترتيب الجديد في الكونسول
    // console.log("Updated Arrangement:", arrangement);

    // تعريف الـ ids بناءً على العناصر
    const ids = reorderedSections.map((section) => section.id);

    // إظهار الـ IDs في الترتيب الجديد
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // console.log("Updated IDs:", updatedIds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">
            Loading {labelLoading}...
          </p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">
            Error loading {labelLoading}
          </p>
        </div>
      ) : Array.isArray(currentItems) && currentItems.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {currentItems.map((section, index) => {
            let deletedAt = section?.deleted_at;
            let isDefault = section?.default;
            return (
              <div
                key={section.id}
                className={`card bg-popover ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
              >
                <CardHeader
                  imageUrl={`${BASE_URL()}/${subdomain}/${section.image}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                />

                <CardContent
                  sectionName={section?.name_en}
                  description={truncateDescription(section?.description_en, 80)}
                  isActive={getStatus(section)}
                  onChangeStatus={() => handlechangeStatus(section.id)}
                  isSection={true}
                  className="card-content"
                  trans={trans}
                  deletedAt={section?.actions?.deletedAt}
                  isLoading={isLoadingStatus}
                  isSettingLoading={isSettingLoading}
                />
                <CardFooter
                  sectionName={section?.name}
                  onViewEdit={() => handleViewEdit(section.id)}
                  onDelete={() => handleDelete(section.id)}
                  onRestore={() => handleRestore(section.id)}
                  onEnter={() => handleEnter(section.id)}
                  // checked={getStatusDefault(section)}
                  isActiveDefault={() => handleDefault(section.id)}
                  isDefaultForMenu={isDefaultForMenu}
                  isSection={true}
                  trans={trans}
                  isLoading={isLoadingStatus}
                  isDefault={isDefault}
                  deletedAt={deletedAt}
                  isSettingLoading={isSettingLoading}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray-500 py-10">
            No {labelLoading} found
          </p>
        </div>
      )}
    </div>
  );
}

export default CardGridRenderer;
