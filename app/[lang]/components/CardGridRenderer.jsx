import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/CardSections";
function CardGridRenderer({
  currentItems,
  isLoading,
  error,
  draggedIndex,
  setLocalStatuses,
  localStatuses,
  trans,
  isLoadingStatus,
}) {
  const truncateDescription = (description, maxLength = 50) => {
    // console.log("Description received:", description);
    if (!description) return "";
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };
  const handleViewEdit = () => {
    console.log("View/Edit clicked");
  };

  const handleDelete = () => {
    console.log("Delete clicked");
  };

  const handleToggleActive = (checked, sectionId) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [sectionId]: checked,
    }));
  };
  const getStatus = (section) => {
    // لو المستخدم غيّر السويتش، نستخدم القيمة اللي في localStatuses
    if (section.id in localStatuses) return localStatuses[section.id];
    // وإلا نرجع القيمة الأصلية من الـ API
    return !!section.status;
  };
  const handleEnter = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}`);
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
    const ids = reorderedSections.map((section) => section.id); // هنا نحصل على الـ ids من العناصر المعدلة

    // إظهار الـ IDs في الترتيب الجديد
    const updatedIds = arrangement.map((index) => ids[index - 1]);

    // console.log("Updated IDs:", updatedIds);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  //  edit & view
  const handleNavigate = (sectionId) => {
    router.push(`/${lang}/dashboard/section/${sectionId}/view`);
  };
  if (isLoading)
    return <p className="text-center text-gray-500 py-10">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-gray-500 py-10">Error loading data</p>
    );

  if (!Array.isArray(currentItems) || currentItems.length === 0)
    return (
      <p className="text-center text-gray-500 py-10">No items to display</p>
    );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {currentItems.map((section, index) => (
        <div
          key={section.id}
          className={`card bg-popover ${
            draggedIndex === index ? "opacity-50" : ""
          }`}
        >
          <CardHeader
            imageUrl={section.image}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          />

          <CardContent
            sectionName={section?.name}
            description={truncateDescription(section?.description, 80)}
            isActive={getStatus(section)}
            onToggleActive={(checked) =>
              handleToggleActive(checked, section.id)
            }
            isSection={true}
            className="card-content"
            trans={trans}
            deletedAt={section?.actions?.deletedAt}
          />
          <CardFooter
            sectionName={section?.name}
            onViewEdit={() => handleNavigate(section.id)}
            onDelete={() => handleDeleteSection(section.id)}
            onEnter={() => handleEnter(section.id)}
            // isActive={section?.status?.id === ACTIVE_STATUS_ID}
            onToggleActive={(checked) =>
              handleToggleActive(checked, section.id, section.status?.id)
            }
            isDefault={false}
            isSection={true}
            trans={trans}
            isLoading={isLoadingStatus}
          />
        </div>
      ))}
    </div>
  );
}

export default CardGridRenderer;
