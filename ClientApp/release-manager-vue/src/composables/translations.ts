export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    releases: 'Releases',
    releaseItems: 'Release Items',
    projects: 'Projects',
    teams: 'Teams',

    // Dashboard
    releaseDashboard: 'Release Dashboard',
    monitorReleases: 'Monitor and manage your software releases',
    refresh: 'Refresh',
    newRelease: 'New Release',
    inProgress: 'In Progress',
    readyForDeploy: 'Ready for Deploy',
    deployed: 'Deployed',
    planning: 'Planning',
    testing: 'Testing',
    cancelled: 'Cancelled',

    // Projects
    manageProjects: 'Manage your software projects',
    searchProjects: 'Search projects...',
    newProject: 'New Project',
    noProjectsFound: 'No projects found',
    createFirstProject: 'Create your first project to get started',
    createProject: 'Create Project',
    editProject: 'Edit Project',
    createNewProject: 'Create New Project',
    projectName: 'Project Name',
    projectCode: 'Project Code',
    assignedTeam: 'Assigned Team',
    active: 'Active',
    onHold: 'On Hold',
    archived: 'Archived',
    completed: 'Completed',

    // Common
    description: 'Description',
    status: 'Status',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    selectStatus: 'Select status',
    selectTeam: 'Select team',
    allStatus: 'All Status',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    releases: 'الإصدارات',
    releaseItems: 'عناصر الإصدار',
    projects: 'المشاريع',
    teams: 'الفرق',

    // Dashboard
    releaseDashboard: 'لوحة تحكم الإصدارات',
    monitorReleases: 'مراقبة وإدارة إصدارات البرامج',
    refresh: 'تحديث',
    newRelease: 'إصدار جديد',
    inProgress: 'قيد التنفيذ',
    readyForDeploy: 'جاهز للنشر',
    deployed: 'تم النشر',
    planning: 'تخطيط',
    testing: 'اختبار',
    cancelled: 'ملغي',

    // Projects
    manageProjects: 'إدارة مشاريع البرامج',
    searchProjects: 'البحث في المشاريع...',
    newProject: 'مشروع جديد',
    noProjectsFound: 'لم يتم العثور على مشاريع',
    createFirstProject: 'أنشئ أول مشروع للبدء',
    createProject: 'إنشاء مشروع',
    editProject: 'تعديل المشروع',
    createNewProject: 'إنشاء مشروع جديد',
    projectName: 'اسم المشروع',
    projectCode: 'رمز المشروع',
    assignedTeam: 'الفريق المخصص',
    active: 'نشط',
    onHold: 'معلق',
    archived: 'مؤرشف',
    completed: 'مكتمل',

    // Common
    description: 'الوصف',
    status: 'الحالة',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    selectStatus: 'اختر الحالة',
    selectTeam: 'اختر الفريق',
    allStatus: 'جميع الحالات',
  },
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;
