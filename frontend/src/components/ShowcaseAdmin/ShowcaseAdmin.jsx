import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  AlertCircle,
  ShieldCheck,
  Award,
  Factory,
  Globe2,
  Package,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Link as LinkIcon,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  getLocalShowcaseItems,
  fetchRemoteShowcaseItems,
  fetchAllLanguagesShowcase,
  saveShowcaseItems,
  saveAllLanguagesShowcase,
  uploadShowcaseImage,
  resetShowcaseItems
} from '../../services/showcaseService';
import { vi } from '../../locales/vi';
import { en } from '../../locales/en';
import { zh } from '../../locales/zh';
import './ShowcaseAdmin.css';

const LOCALE_DATA = { vi, en, zh };

const PRESET_IMAGES = [
  { name: 'Cà phê thu hoạch', path: '/assets/images/b2b-showcase/coffee-harvest.jpg' },
  { name: 'Thủy sản xuất khẩu', path: '/assets/images/b2b-showcase/seafood-export.webp' },
  { name: 'Gạo ST25 vàng', path: '/assets/images/b2b-showcase/golden-rice.jpg' },
  { name: 'Gia vị hạt tiêu', path: '/assets/images/b2b-showcase/vietnam-spices.jpg' },
  { name: 'Trái cây nhiệt đới', path: '/assets/images/b2b-showcase/tropical-fruits.jpg' },
  { name: 'Mây tre thủ công', path: '/assets/images/b2b-showcase/eco-handicraft.jpg' }
];

// Localized product template for newly added products
const getNewProductTemplate = (lang, id, orderNum, image = '/assets/images/b2b-showcase/tropical-fruits.jpg') => {
  if (lang === 'vi') {
    return {
      id,
      category: 'Nông Sản Xuất Khẩu Mới',
      title: `Sản Phẩm Xuất Khẩu #${orderNum}`,
      subtitle: 'Đạt tiêu chuẩn xuất khẩu sang thị trường cao cấp',
      image,
      origin: 'Việt Nam',
      capacity: '1,000 Tấn / Năm',
      standards: 'ISO 22000, HACCP, FDA',
      markets: 'Mỹ, EU, Nhật Bản, Trung Đông',
      packaging: 'Đóng gói tiêu chuẩn xuất khẩu theo yêu cầu',
      description: 'Mô tả chi tiết về nguồn gốc, quy trình tuyển chọn và năng lực sản xuất của sản phẩm.',
      highlights: [
        'Nguồn gốc minh bạch, kiểm định độc lập',
        'Đạt tiêu chuẩn an toàn thực phẩm quốc tế'
      ]
    };
  } else if (lang === 'zh') {
    return {
      id,
      category: '新出口战略优质农产品',
      title: `战略出口产品 #${orderNum}`,
      subtitle: '符合出口高端市场国际严苛标准',
      image,
      origin: '越南',
      capacity: '1,000 吨 / 年',
      standards: 'ISO 22000, HACCP, FDA',
      markets: '美国, 欧盟, 日本, 中东',
      packaging: '按需提供符合国际标准的定制出口包装',
      description: '详细说明产品的产地、严格挑选工艺及深加工产能。',
      highlights: [
        '产地透明，独立第三方检测合格',
        '符合国际食品安全严苛标准'
      ]
    };
  } else {
    // English default
    return {
      id,
      category: 'New Strategic Export Produce',
      title: `Strategic Export Product #${orderNum}`,
      subtitle: 'Certified for global tier-1 supply chains',
      image,
      origin: 'Vietnam',
      capacity: '1,000 MT / Year',
      standards: 'ISO 22000, HACCP, FDA',
      markets: 'USA, EU, Japan, Middle East',
      packaging: 'Standard export packaging tailored on request',
      description: 'Comprehensive description of origin, strict processing standards, and delivery capacity.',
      highlights: [
        'Transparent origin with verified lab audits',
        'Meets international food safety regulations'
      ]
    };
  }
};

// Reconcile catalogs across all 3 languages to ensure EVERY product exists in ALL languages in identical order
const reconcileAllCatalogs = (allData, masterLang = 'vi') => {
  const languages = ['vi', 'en', 'zh'];
  const orderedLanguages = [masterLang, ...languages.filter(l => l !== masterLang)];
  const idOrder = [];
  const itemsById = {};

  // Collect all unique IDs prioritizing masterLang order
  orderedLanguages.forEach(l => {
    const list = Array.isArray(allData?.[l]) ? allData[l] : [];
    list.forEach(item => {
      if (item && item.id) {
        const normId = item.id === 'handicrafts' ? 'handicraft' : item.id;
        const normItem = normId !== item.id ? { ...item, id: normId } : item;
        if (!itemsById[normId]) {
          itemsById[normId] = {};
          idOrder.push(normId);
        }
        if (!itemsById[normId][l]) {
          itemsById[normId][l] = normItem;
        }
      }
    });
  });

  const reconciled = {};
  languages.forEach(l => {
    reconciled[l] = idOrder.map((id, idx) => {
      if (itemsById[id][l]) {
        return itemsById[id][l];
      }
      // If missing in language l, build template with donor metadata
      const donorLang = Object.keys(itemsById[id])[0] || 'vi';
      const donorItem = itemsById[id][donorLang] || {};
      const template = getNewProductTemplate(l, id, idx + 1, donorItem.image);
      return {
        ...template,
        image: donorItem.image || template.image,
        capacity: donorItem.capacity || template.capacity,
        standards: donorItem.standards || template.standards,
        markets: donorItem.markets || template.markets,
        packaging: donorItem.packaging || template.packaging
      };
    });
  });

  return reconciled;
};

export default function ShowcaseAdmin({ onBackToHome }) {
  const [activeLang, setActiveLang] = useState('vi');
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const selectedIdRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const mobileStripRef = useRef(null);
  const activeMobileCardRef = useRef(null);
  const isStripPointerDownRef = useRef(false);
  const stripStartXRef = useRef(0);
  const stripScrollLeftRef = useRef(0);
  const hasStripDraggedRef = useRef(false);

  // Auto-scroll the active product card into view on mobile
  useEffect(() => {
    if (activeMobileCardRef.current && mobileStripRef.current) {
      activeMobileCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Pointer/mouse drag handlers for smooth swiping on mobile & PC
  const handleStripPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isStripPointerDownRef.current = true;
    hasStripDraggedRef.current = false;
    stripStartXRef.current = e.pageX - (mobileStripRef.current?.offsetLeft || 0);
    stripScrollLeftRef.current = mobileStripRef.current?.scrollLeft || 0;
  };

  const handleStripPointerMove = (e) => {
    if (!isStripPointerDownRef.current || !mobileStripRef.current) return;
    const x = e.pageX - (mobileStripRef.current.offsetLeft || 0);
    const walk = x - stripStartXRef.current;
    if (Math.abs(walk) > 5) {
      hasStripDraggedRef.current = true;
      mobileStripRef.current.classList.add('is-dragging');
    }
    mobileStripRef.current.scrollLeft = stripScrollLeftRef.current - walk;
  };

  const handleStripPointerUp = () => {
    isStripPointerDownRef.current = false;
    if (mobileStripRef.current) {
      mobileStripRef.current.classList.remove('is-dragging');
    }
    setTimeout(() => {
      hasStripDraggedRef.current = false;
    }, 60);
  };

  const handleScrollStrip = (direction) => {
    if (mobileStripRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      mobileStripRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Helper to select a product and remember its unique ID
  const handleSelectProduct = (idx) => {
    setSelectedIndex(idx);
    const targetItem = items[idx];
    if (targetItem?.id) {
      const normId = targetItem.id === 'handicrafts' ? 'handicraft' : targetItem.id;
      setSelectedId(normId);
      selectedIdRef.current = normId;
    }
  };

  // Load items when language changes & keep exact same product selected
  useEffect(() => {
    const rawAll = {};
    const languages = ['vi', 'en', 'zh'];
    languages.forEach(l => {
      const defaultItems = LOCALE_DATA[l]?.b2bShowcase?.items || [];
      rawAll[l] = getLocalShowcaseItems(l, defaultItems);
    });

    const reconciled = reconcileAllCatalogs(rawAll, activeLang);
    languages.forEach(l => {
      try {
        localStorage.setItem(`keta_custom_showcase_${l}`, JSON.stringify(reconciled[l]));
      } catch (e) {}
    });

    const activeList = reconciled[activeLang] || [];
    setItems(activeList);

    // Keep the exact same product selected across languages by ID
    const targetId = selectedIdRef.current || selectedId;
    if (targetId) {
      const foundIdx = activeList.findIndex(it => it.id === targetId);
      if (foundIdx >= 0) {
        setSelectedIndex(foundIdx);
      } else {
        setSelectedIndex(prev => (prev < activeList.length ? prev : Math.max(0, activeList.length - 1)));
      }
    } else {
      if (activeList[0]?.id) {
        setSelectedId(activeList[0].id);
        selectedIdRef.current = activeList[0].id;
      }
      setSelectedIndex(0);
    }

    // Remote sync: Fetch all languages from backend and keep selection intact
    fetchAllLanguagesShowcase().then(remoteAll => {
      if (remoteAll && typeof remoteAll === 'object') {
        const remoteReconciled = reconcileAllCatalogs(remoteAll, activeLang);
        const remoteActiveList = remoteReconciled[activeLang];
        if (remoteActiveList && remoteActiveList.length > 0) {
          setItems(remoteActiveList);
          const currentTargetId = selectedIdRef.current || targetId;
          if (currentTargetId) {
            const foundIdx = remoteActiveList.findIndex(it => it.id === currentTargetId);
            if (foundIdx >= 0) setSelectedIndex(foundIdx);
          }
        }
      }
    });
  }, [activeLang]);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const selectedItem = items[selectedIndex] || items[0] || null;

  // Handle field change on selected item
  const handleFieldChange = (field, value) => {
    if (selectedIndex < 0 || selectedIndex >= items.length) return;
    setItems(prev => {
      const copy = [...prev];
      copy[selectedIndex] = {
        ...copy[selectedIndex],
        [field]: value
      };
      return copy;
    });
  };

  // Handle Highlights modification
  const handleHighlightChange = (hIdx, value) => {
    setItems(prev => {
      const copy = [...prev];
      const cur = { ...copy[selectedIndex] };
      const highlights = [...(cur.highlights || [])];
      highlights[hIdx] = value;
      cur.highlights = highlights;
      copy[selectedIndex] = cur;
      return copy;
    });
  };

  const handleAddHighlight = () => {
    setItems(prev => {
      const copy = [...prev];
      const cur = { ...copy[selectedIndex] };
      cur.highlights = [...(cur.highlights || []), 'Tiêu chuẩn chất lượng vượt trội'];
      copy[selectedIndex] = cur;
      return copy;
    });
  };

  const handleRemoveHighlight = (hIdx) => {
    setItems(prev => {
      const copy = [...prev];
      const cur = { ...copy[selectedIndex] };
      cur.highlights = (cur.highlights || []).filter((_, i) => i !== hIdx);
      copy[selectedIndex] = cur;
      return copy;
    });
  };

  // Handle Back to Home with auto-save
  const handleBackToHome = async () => {
    try {
      if (items.length > 0) {
        await saveShowcaseItems(activeLang, items);
      }
    } catch (err) {
      console.warn('Auto-save on exit error:', err);
    }
    onBackToHome();
  };

  // Helper to get fresh reconciled copies of all 3 language catalogs
  const getAllLanguagesCatalogs = () => {
    const languages = ['vi', 'en', 'zh'];
    const rawData = {};
    languages.forEach(l => {
      if (l === activeLang && items && items.length > 0) {
        rawData[l] = JSON.parse(JSON.stringify(items));
      } else {
        const defaultItems = LOCALE_DATA[l]?.b2bShowcase?.items || [];
        const current = getLocalShowcaseItems(l, defaultItems);
        rawData[l] = JSON.parse(JSON.stringify(current));
      }
    });
    return reconcileAllCatalogs(rawData, activeLang);
  };

  // Safe language switcher with auto-save of current edits & preserving selected product
  const handleSwitchLanguage = async (newLang) => {
    if (newLang === activeLang) return;

    // 1. Remember the currently selected product ID before switching
    const currentProduct = items[selectedIndex];
    if (currentProduct?.id) {
      const normId = currentProduct.id === 'handicrafts' ? 'handicraft' : currentProduct.id;
      setSelectedId(normId);
      selectedIdRef.current = normId;
    }

    // 2. Auto-save current active language items to local & backend
    if (items && items.length > 0) {
      try {
        await saveShowcaseItems(activeLang, items);
      } catch (err) {
        console.warn('Auto-save before lang switch error:', err);
      }
    }

    // 3. Switch active language
    setActiveLang(newLang);
  };

  // Synchronize image across all 3 languages for the currently selected product
  const syncImageAcrossAllLanguages = async (newUrl) => {
    const allData = getAllLanguagesCatalogs();
    const currentId = selectedItem?.id || selectedIdRef.current;
    const currentIdx = selectedIndex;

    const languages = ['vi', 'en', 'zh'];
    languages.forEach(l => {
      const list = allData[l] || [];
      allData[l] = list.map((item, idx) => {
        if ((currentId && item.id === currentId) || idx === currentIdx) {
          return { ...item, image: newUrl };
        }
        return item;
      });
    });

    setItems(allData[activeLang]);
    try {
      await saveAllLanguagesShowcase(allData);
    } catch (err) {
      console.warn('Sync image error:', err);
    }
  };

  // Copy specs & image of current product to the other 2 languages
  const handleSyncToOtherLanguages = async () => {
    if (!selectedItem) return;
    const currentId = selectedItem.id;
    const allData = getAllLanguagesCatalogs();

    const otherLangs = ['vi', 'en', 'zh'].filter(l => l !== activeLang);
    otherLangs.forEach(l => {
      const list = allData[l] || [];
      allData[l] = list.map((it, idx) => {
        if ((currentId && it.id === currentId) || idx === selectedIndex) {
          return {
            ...it,
            image: selectedItem.image || it.image,
            capacity: selectedItem.capacity || it.capacity,
            standards: selectedItem.standards || it.standards,
            markets: selectedItem.markets || it.markets,
            packaging: selectedItem.packaging || it.packaging,
            origin: selectedItem.origin || it.origin
          };
        }
        return it;
      });
    });

    try {
      await saveAllLanguagesShowcase(allData);
      showToast(
        `Đã sao chép ảnh & thông số kỹ thuật của sản phẩm #${selectedIndex + 1} sang ${otherLangs.map(l => l.toUpperCase()).join(' & ')}!`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi sao chép thông số', 'error');
    }
  };

  // Reorder items in lockstep across all 3 languages
  const handleMoveUp = async (idx, e) => {
    e.stopPropagation();
    if (idx === 0) return;

    // 1. Reorder in active language
    const copy = [...items];
    const temp = copy[idx - 1];
    copy[idx - 1] = copy[idx];
    copy[idx] = temp;

    // 2. The order of IDs in active language is the master sequence
    const masterOrderIds = copy.map(it => (it.id === 'handicrafts' ? 'handicraft' : it.id));

    // 3. Reorder ALL 3 languages to match this exact master sequence
    const allData = getAllLanguagesCatalogs();
    const languages = ['vi', 'en', 'zh'];

    languages.forEach(l => {
      if (l === activeLang) {
        allData[l] = copy;
      } else {
        const list = allData[l] || [];
        const itemMap = new Map();
        list.forEach(it => {
          if (it?.id) {
            const normId = it.id === 'handicrafts' ? 'handicraft' : it.id;
            itemMap.set(normId, { ...it, id: normId });
          }
        });

        const reordered = masterOrderIds
          .map(id => itemMap.get(id))
          .filter(Boolean);

        list.forEach(it => {
          const normId = it?.id === 'handicrafts' ? 'handicraft' : it?.id;
          if (normId && !masterOrderIds.includes(normId)) {
            reordered.push(it);
          }
        });

        allData[l] = reordered;
      }
    });

    setItems(copy);
    const newIdx = idx - 1;
    setSelectedIndex(newIdx);
    if (copy[newIdx]?.id) {
      const normId = copy[newIdx].id === 'handicrafts' ? 'handicraft' : copy[newIdx].id;
      setSelectedId(normId);
      selectedIdRef.current = normId;
    }

    try {
      await saveAllLanguagesShowcase(allData);
      showToast('Đã di chuyển vị trí và đồng bộ thứ tự cho cả 3 ngôn ngữ!', 'success');
    } catch (err) {
      console.warn(err);
    }
  };

  const handleMoveDown = async (idx, e) => {
    e.stopPropagation();
    if (idx === items.length - 1) return;

    // 1. Reorder in active language
    const copy = [...items];
    const temp = copy[idx + 1];
    copy[idx + 1] = copy[idx];
    copy[idx] = temp;

    // 2. The order of IDs in active language is the master sequence
    const masterOrderIds = copy.map(it => (it.id === 'handicrafts' ? 'handicraft' : it.id));

    // 3. Reorder ALL 3 languages to match this exact master sequence
    const allData = getAllLanguagesCatalogs();
    const languages = ['vi', 'en', 'zh'];

    languages.forEach(l => {
      if (l === activeLang) {
        allData[l] = copy;
      } else {
        const list = allData[l] || [];
        const itemMap = new Map();
        list.forEach(it => {
          if (it?.id) {
            const normId = it.id === 'handicrafts' ? 'handicraft' : it.id;
            itemMap.set(normId, { ...it, id: normId });
          }
        });

        const reordered = masterOrderIds
          .map(id => itemMap.get(id))
          .filter(Boolean);

        list.forEach(it => {
          const normId = it?.id === 'handicrafts' ? 'handicraft' : it?.id;
          if (normId && !masterOrderIds.includes(normId)) {
            reordered.push(it);
          }
        });

        allData[l] = reordered;
      }
    });

    setItems(copy);
    const newIdx = idx + 1;
    setSelectedIndex(newIdx);
    if (copy[newIdx]?.id) {
      const normId = copy[newIdx].id === 'handicrafts' ? 'handicraft' : copy[newIdx].id;
      setSelectedId(normId);
      selectedIdRef.current = normId;
    }

    try {
      await saveAllLanguagesShowcase(allData);
      showToast('Đã di chuyển vị trí và đồng bộ thứ tự cho cả 3 ngôn ngữ!', 'success');
    } catch (err) {
      console.warn(err);
    }
  };

  // Add new item & auto-save synchronously to all 3 languages (VI, EN, ZH)
  const handleAddItem = async () => {
    const newItemId = `product_${Date.now()}`;
    const allData = getAllLanguagesCatalogs();
    const nextOrderNum = (allData[activeLang]?.length || items.length) + 1;
    const defaultImage = '/assets/images/b2b-showcase/tropical-fruits.jpg';

    // Populate localized default content for all 3 languages simultaneously
    const languages = ['vi', 'en', 'zh'];
    languages.forEach(l => {
      const list = allData[l] || [];
      const order = list.length + 1;
      const newProduct = getNewProductTemplate(l, newItemId, order, defaultImage);
      allData[l] = [...list, newProduct];
    });

    const updatedActiveList = allData[activeLang];
    setItems(updatedActiveList);
    const newIdx = updatedActiveList.length - 1;
    setSelectedIndex(newIdx);
    setSelectedId(newItemId);
    selectedIdRef.current = newItemId;

    // Auto-save immediately to localStorage & backend API for all 3 languages!
    try {
      await saveAllLanguagesShowcase(allData);
      showToast(
        `Đã thêm sản phẩm #${nextOrderNum} đồng bộ cho cả 3 ngôn ngữ (VI, EN, 中文)!`,
        'success'
      );
    } catch (err) {
      console.warn(err);
      showToast(`Đã thêm sản phẩm #${nextOrderNum}!`, 'success');
    }
  };

  // Delete item & auto-save across all 3 languages
  const handleDeleteItem = async (idx, e) => {
    e.stopPropagation();
    if (items.length <= 1) {
      showToast('Danh sách cần giữ lại ít nhất 1 sản phẩm!', 'error');
      return;
    }
    const itemToDelete = items[idx];
    const targetId = itemToDelete?.id;

    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${itemToDelete.title}" trên cả 3 ngôn ngữ?`)) {
      const allData = getAllLanguagesCatalogs();
      const languages = ['vi', 'en', 'zh'];

      languages.forEach(l => {
        const list = allData[l] || [];
        const filtered = list.filter((it, i) => (targetId ? it.id !== targetId : i !== idx));
        allData[l] = filtered.length > 0 ? filtered : list;
      });

      const updatedActive = allData[activeLang];
      setItems(updatedActive);
      const nextIdx = Math.min(idx, Math.max(0, updatedActive.length - 1));
      setSelectedIndex(nextIdx);
      if (updatedActive[nextIdx]?.id) {
        setSelectedId(updatedActive[nextIdx].id);
        selectedIdRef.current = updatedActive[nextIdx].id;
      }

      try {
        await saveAllLanguagesShowcase(allData);
        showToast('Đã xóa sản phẩm trên cả 3 ngôn ngữ và cập nhật website!', 'info');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Auto-save on field blur so no edit is ever lost
  const handleFieldBlur = () => {
    if (items && items.length > 0) {
      saveShowcaseItems(activeLang, items).catch(err => console.warn(err));
    }
  };

  // Select Preset Image & Auto-save across all 3 languages
  const handleSelectPreset = async (presetPath) => {
    await syncImageAcrossAllLanguages(presetPath);
    showToast('Đã áp dụng và lưu ảnh mẫu cho cả 3 ngôn ngữ!', 'success');
  };

  // Upload Image Handler & Auto-save synchronously across all 3 languages
  const handleImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP)', 'error');
      return;
    }

    try {
      setIsUploading(true);
      showToast('Đang tải và tối ưu ảnh lên hệ thống...', 'info');
      const url = await uploadShowcaseImage(file);
      await syncImageAcrossAllLanguages(url);
      showToast('Đã tải lên và đồng bộ ảnh mới cho cả 3 ngôn ngữ!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Tải ảnh thất bại, vui lòng thử lại', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveShowcaseItems(activeLang, items);
      showToast(`Đã lưu thành công ${items.length} sản phẩm (${activeLang.toUpperCase()})!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi lưu dữ liệu. Đã sao lưu trên trình duyệt của bạn.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset factory defaults
  const handleReset = async () => {
    try {
      await resetShowcaseItems(activeLang);
      const defaultLocaleItems = LOCALE_DATA[activeLang]?.b2bShowcase?.items || [];
      setItems(JSON.parse(JSON.stringify(defaultLocaleItems)));
      setSelectedIndex(0);
      setShowResetConfirm(false);
      showToast(`Đã khôi phục dữ liệu gốc cho ${activeLang.toUpperCase()}!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi khôi phục dữ liệu', 'error');
    }
  };

  return (
    <div className="showcase-admin-root">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast toast-${toast.type}`} role="alert">
          {toast.type === 'success' && <Check size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <RefreshCw size={18} className="animate-spin" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="admin-header">
        <div className="admin-header-main-row">
          <div className="admin-header-left">
            <button
              type="button"
              className="btn-back-home"
              onClick={handleBackToHome}
              title="Quay lại trang chính"
            >
              <ArrowLeft size={16} />
              <span className="back-text-full">Về Website</span>
              <span className="back-text-short">Web</span>
            </button>

            <div className="admin-brand-info">
              <img src="/assets/logo/keta-logo.png" alt="KETA Global" className="admin-logo" />
            </div>
          </div>

          {/* Desktop Center: Language Switcher Tabs */}
          <div className="admin-lang-tabs desktop-lang-tabs" role="tablist">
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'vi' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('vi')}
            >
              <span className="lang-flag">🇻🇳</span>
              <span>Tiếng Việt</span>
            </button>
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'en' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('en')}
            >
              <span className="lang-flag">🇬🇧</span>
              <span>English</span>
            </button>
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'zh' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('zh')}
            >
              <span className="lang-flag">🇨🇳</span>
              <span>简体中文</span>
            </button>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="admin-header-actions desktop-header-actions">
            <button
              type="button"
              className="btn-admin-reset"
              onClick={() => setShowResetConfirm(true)}
              title="Khôi phục lại dữ liệu mặc định ban đầu"
            >
              <RotateCcw size={16} />
              <span>Khôi phục mặc định</span>
            </button>

            <button
              type="button"
              className="btn-admin-save"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save size={17} />
              <span>{isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>

          {/* Mobile Quick Save Button */}
          <button
            type="button"
            className="btn-admin-save mobile-save-btn"
            onClick={handleSave}
            disabled={isSaving}
            title="Lưu tất cả thay đổi"
          >
            <Save size={15} />
            <span>{isSaving ? 'Lưu...' : 'Lưu'}</span>
          </button>
        </div>

        {/* Mobile Sub Bar: Language switcher + Reset button */}
        <div className="admin-header-mobile-subbar">
          <div className="admin-lang-tabs mobile-lang-tabs" role="tablist">
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'vi' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('vi')}
            >
              <span className="lang-flag">🇻🇳</span>
              <span>Tiếng Việt</span>
            </button>
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'en' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('en')}
            >
              <span className="lang-flag">🇬🇧</span>
              <span>English</span>
            </button>
            <button
              type="button"
              className={`admin-lang-tab ${activeLang === 'zh' ? 'active' : ''}`}
              onClick={() => handleSwitchLanguage('zh')}
            >
              <span className="lang-flag">🇨🇳</span>
              <span>中文</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-admin-reset mobile-reset-btn"
            onClick={() => setShowResetConfirm(true)}
            title="Khôi phục dữ liệu gốc"
          >
            <RotateCcw size={13} />
            <span>Đặt lại</span>
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-backdrop">
          <div className="reset-modal-box">
            <div className="modal-icon-wrap">
              <AlertCircle size={32} className="modal-icon-warn" />
            </div>
            <h3 className="modal-title">Xác Nhận Khôi Phục Dữ Liệu?</h3>
            <p className="modal-desc">
              Thao tác này sẽ đặt lại toàn bộ danh sách sản phẩm và hình ảnh ngôn ngữ <strong>{activeLang.toUpperCase()}</strong> về cài đặt xuất xưởng nguyên bản của hệ thống.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setShowResetConfirm(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleReset}
              >
                Đồng ý Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="admin-workspace">
        {/* Mobile Product Navigation Strip (Visible on mobile <= 820px, replaces tall sidebar) */}
        <div className="mobile-product-strip">
          <div className="mobile-strip-header">
            <div className="mobile-strip-info">
              <span className="mobile-strip-count">
                Sản phẩm <strong>#{selectedIndex + 1}</strong> / {items.length}
              </span>
              <div className="mobile-strip-reorder">
                <button
                  type="button"
                  className="mobile-reorder-btn"
                  disabled={selectedIndex === 0}
                  onClick={(e) => handleMoveUp(selectedIndex, e)}
                  title="Di chuyển lên"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="mobile-reorder-btn"
                  disabled={selectedIndex === items.length - 1}
                  onClick={(e) => handleMoveDown(selectedIndex, e)}
                  title="Di chuyển xuống"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="mobile-reorder-btn delete-btn"
                  onClick={(e) => handleDeleteItem(selectedIndex, e)}
                  title="Xóa sản phẩm này"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="mobile-strip-actions">
              <div className="mobile-strip-nav-arrows">
                <button
                  type="button"
                  className="mobile-scroll-arrow-btn"
                  onClick={() => handleScrollStrip('left')}
                  title="Cuộn sang trái"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  className="mobile-scroll-arrow-btn"
                  onClick={() => handleScrollStrip('right')}
                  title="Cuộn sang phải"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <button
                type="button"
                className="mobile-add-btn"
                onClick={handleAddItem}
              >
                <Plus size={14} />
                <span>Thêm SP</span>
              </button>
            </div>
          </div>

          <div
            ref={mobileStripRef}
            className="mobile-strip-scroll"
            onPointerDown={handleStripPointerDown}
            onPointerMove={handleStripPointerMove}
            onPointerUp={handleStripPointerUp}
            onPointerLeave={handleStripPointerUp}
            onPointerCancel={handleStripPointerUp}
          >
            {items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id || idx}
                  ref={isSelected ? activeMobileCardRef : null}
                  type="button"
                  className={`mobile-strip-card ${isSelected ? 'is-active' : ''}`}
                  onClick={() => {
                    if (!hasStripDraggedRef.current) {
                      handleSelectProduct(idx);
                    }
                  }}
                >
                  <span className="mobile-card-num">#{idx + 1}</span>
                  <div className="mobile-card-thumb">
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/b2b-showcase/tropical-fruits.jpg';
                      }}
                    />
                  </div>
                  <div className="mobile-card-text">
                    <span className="mobile-card-cat">{item.category || 'Mục #' + (idx + 1)}</span>
                    <span className="mobile-card-title">{item.title || 'Chưa đặt tên'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Column: Product Directory (Desktop only) */}
        <aside className="admin-sidebar-list">
          <div className="sidebar-list-header">
            <div className="list-title-row">
              <span className="list-title">Danh Sách Sản Phẩm</span>
              <span className="list-count-badge">{items.length} mục</span>
            </div>
            <button
              type="button"
              className="btn-add-product"
              onClick={handleAddItem}
            >
              <Plus size={16} />
              <span>Thêm Sản Phẩm</span>
            </button>
          </div>

          <div className="sidebar-product-items">
            {items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  className={`product-nav-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectProduct(idx)}
                >
                  <div className="product-nav-order">{idx + 1}</div>
                  <div className="product-nav-thumb">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/b2b-showcase/tropical-fruits.jpg';
                      }}
                    />
                  </div>
                  <div className="product-nav-info">
                    <span className="product-nav-cat">{item.category || 'Chưa phân loại'}</span>
                    <h4 className="product-nav-title">{item.title || 'Chưa đặt tên'}</h4>
                  </div>

                  <div className="product-nav-controls">
                    <button
                      type="button"
                      className="nav-control-btn"
                      disabled={idx === 0}
                      onClick={(e) => handleMoveUp(idx, e)}
                      title="Di chuyển lên"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="nav-control-btn"
                      disabled={idx === items.length - 1}
                      onClick={(e) => handleMoveDown(idx, e)}
                      title="Di chuyển xuống"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="nav-control-btn delete-btn"
                      onClick={(e) => handleDeleteItem(idx, e)}
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Column: Detailed Product Editor Form */}
        <main className="admin-editor-panel">
          {selectedItem ? (
            <div className="editor-form-scroll">
              <div className="editor-panel-header">
                <div className="editor-header-meta">
                  <span className="editor-badge">Sản Phẩm #{selectedIndex + 1}</span>
                  <div className="editor-header-actions-inline">
                    {/* Desktop: clean indicator (language is selected from top header tabs) */}
                    <div className="editor-lang-indicator desktop-lang-indicator">
                      Đang chỉnh sửa: <strong>{activeLang.toUpperCase()}</strong>
                    </div>

                    {/* Mobile only: Quick Language Switcher directly above editing fields */}
                    <div className="editor-lang-selector-bar mobile-lang-selector-bar">
                      <span className="editor-lang-selector-label">Ngôn ngữ:</span>
                      <div className="editor-lang-pill-tabs">
                        <button
                          type="button"
                          className={`editor-lang-pill ${activeLang === 'vi' ? 'is-active' : ''}`}
                          onClick={() => handleSwitchLanguage('vi')}
                          title="Chỉnh sửa nội dung Tiếng Việt"
                        >
                          <span className="pill-flag">🇻🇳</span>
                          <span>Tiếng Việt</span>
                        </button>
                        <button
                          type="button"
                          className={`editor-lang-pill ${activeLang === 'en' ? 'is-active' : ''}`}
                          onClick={() => handleSwitchLanguage('en')}
                          title="Chỉnh sửa nội dung English"
                        >
                          <span className="pill-flag">🇬🇧</span>
                          <span>English</span>
                        </button>
                        <button
                          type="button"
                          className={`editor-lang-pill ${activeLang === 'zh' ? 'is-active' : ''}`}
                          onClick={() => handleSwitchLanguage('zh')}
                          title="Chỉnh sửa nội dung 简体中文"
                        >
                          <span className="pill-flag">🇨🇳</span>
                          <span>中文</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-sync-languages"
                      onClick={handleSyncToOtherLanguages}
                      title="Sao chép ảnh và thông số kỹ thuật (xuất xứ, sản lượng, tiêu chuẩn, thị trường, đóng gói) sang Tiếng Anh & Tiếng Trung"
                    >
                      <Globe2 size={14} />
                      <span>Sao chép thông số sang 2 ngôn ngữ</span>
                    </button>
                  </div>
                </div>
                <h2 className="editor-headline">{selectedItem.title || 'Chỉnh Sửa Sản Phẩm'}</h2>
              </div>

              {/* SECTION 1: HÌNH ẢNH SẢN PHẨM */}
              <div className="form-section-card">
                <div className="section-header-row">
                  <div className="section-title-wrap">
                    <Sparkles size={18} className="gold-icon" />
                    <h3 className="section-title">1. Hình Ảnh Đại Diện Sản Phẩm</h3>
                  </div>
                  <span className="section-hint">Hỗ trợ JPG, PNG, WEBP tỷ lệ 16:10 hoặc 4:3</span>
                </div>

                <div className="image-manager-container">
                  {/* Top Row: Current image preview + Upload drop zone */}
                  <div className="image-top-row">
                    <div className="current-image-preview">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/b2b-showcase/tropical-fruits.jpg';
                        }}
                      />
                    </div>

                    {/* Upload Drop Zone */}
                    <div
                      className={`drag-drop-zone ${isDragging ? 'is-dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      <Upload size={30} className="upload-icon" />
                      <div className="upload-text">
                        <strong>Bấm để chọn tệp</strong> hoặc kéo thả hình ảnh vào đây
                      </div>
                      <span className="upload-subtext">Hỗ trợ JPG, PNG, WEBP (Tự động lưu vào hệ thống)</span>
                    </div>
                  </div>

                  {/* Built-in Presets (full width) */}
                  <div className="preset-selector-wrap">
                    <span className="preset-label">Hoặc chọn nhanh từ thư viện mẫu chuẩn KETA:</span>
                    <div className="preset-thumbnails-row">
                      {PRESET_IMAGES.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          className={`preset-thumb-btn ${selectedItem.image === preset.path ? 'is-active' : ''}`}
                          onClick={() => handleSelectPreset(preset.path)}
                          title={preset.name}
                        >
                          <img src={preset.path} alt={preset.name} />
                          <span className="preset-name">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: THÔNG TIN CƠ BẢN */}
              <div className="form-section-card">
                <div className="section-title-wrap">
                  <Package size={18} className="gold-icon" />
                  <h3 className="section-title">2. Thông Tin Thương Mại Cơ Bản</h3>
                </div>

                <div className="form-grid-2col">
                  <div className="input-field-group">
                    <label className="field-label">Tên sản phẩm (Title):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="VD: Cà Phê Robusta & Arabica Chế Biến Sâu"
                    />
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">Danh mục / Ngành hàng (Category):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.category || ''}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      placeholder="VD: Cà Phê & Nông Sản Vùng Cao"
                    />
                  </div>

                  <div className="input-field-group col-span-2">
                    <label className="field-label">Tiêu đề phụ / Định vị giá trị (Subtitle):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.subtitle || ''}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      placeholder="VD: Hương vị Tây Nguyên & Cầu Đất chinh phục thị trường Âu - Mỹ"
                    />
                  </div>

                  <div className="input-field-group col-span-2">
                    <label className="field-label">Vùng nguyên liệu / Xuất xứ (Origin):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.origin || ''}
                      onChange={(e) => handleFieldChange('origin', e.target.value)}
                      placeholder="VD: Đắk Lắk, Gia Lai & Cầu Đất (Lâm Đồng)"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: THÔNG SỐ VẬN HÀNH & XUẤT KHẨU */}
              <div className="form-section-card">
                <div className="section-title-wrap">
                  <Factory size={18} className="gold-icon" />
                  <h3 className="section-title">3. Thông Số Vận Hành & Tiêu Chuẩn Xuất Khẩu</h3>
                </div>

                <div className="form-grid-2col">
                  <div className="input-field-group">
                    <label className="field-label">Năng lực sản xuất (Capacity):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.capacity || ''}
                      onChange={(e) => handleFieldChange('capacity', e.target.value)}
                      placeholder="VD: 60,000 Tấn / Năm"
                    />
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">Tiêu chuẩn & Chứng nhận (Standards):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.standards || ''}
                      onChange={(e) => handleFieldChange('standards', e.target.value)}
                      placeholder="VD: FDA, USDA Organic, Fairtrade, ISO 22000"
                    />
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">Thị trường xuất khẩu trọng điểm (Key Markets):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.markets || ''}
                      onChange={(e) => handleFieldChange('markets', e.target.value)}
                      placeholder="VD: Mỹ, Đức, Ý, Nhật Bản, Úc, Singapore"
                    />
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">Quy cách đóng gói & Vận chuyển (Packaging):</label>
                    <input
                      type="text"
                      className="admin-input-text"
                      value={selectedItem.packaging || ''}
                      onChange={(e) => handleFieldChange('packaging', e.target.value)}
                      placeholder="VD: Bao đay 60kg lót GrainPro / Hút chân không"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MÔ TẢ CHIẾN LƯỢC */}
              <div className="form-section-card">
                <div className="section-title-wrap">
                  <Award size={18} className="gold-icon" />
                  <h3 className="section-title">4. Mô Tả Chiến Lược Nguồn Cung</h3>
                </div>

                <div className="input-field-group">
                  <label className="field-label">Nội dung chi tiết giới thiệu đến đối tác toàn cầu:</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={selectedItem.description || ''}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Nhập mô tả toàn diện về chất lượng nguyên liệu, kiểm soát độ ẩm, chỉ số kiểm định..."
                  />
                </div>
              </div>

              {/* SECTION 5: ĐIỂM NHẤN CHẤT LƯỢNG (HIGHLIGHTS) */}
              <div className="form-section-card">
                <div className="section-header-row">
                  <div className="section-title-wrap">
                    <CheckCircle2 size={18} className="gold-icon" />
                    <h3 className="section-title">5. Các Điểm Nhấn Chất Lượng (Highlights)</h3>
                  </div>
                  <button
                    type="button"
                    className="btn-add-highlight"
                    onClick={handleAddHighlight}
                  >
                    <Plus size={14} />
                    <span>Thêm Điểm Nhấn</span>
                  </button>
                </div>

                <div className="highlights-editor-list">
                  {(selectedItem.highlights || []).map((h, hIdx) => (
                    <div key={hIdx} className="highlight-row-input">
                      <div className="highlight-bullet-num">{hIdx + 1}</div>
                      <input
                        type="text"
                        className="admin-input-text"
                        value={h}
                        onChange={(e) => handleHighlightChange(hIdx, e.target.value)}
                        placeholder="VD: 100% hạt chín cây chọn lọc thủ công"
                      />
                      <button
                        type="button"
                        className="btn-remove-highlight"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        title="Xóa điểm nhấn này"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {(!selectedItem.highlights || selectedItem.highlights.length === 0) && (
                    <div className="no-highlights-msg">Chưa có điểm nhấn nào. Bấm nút "Thêm Điểm Nhấn" để thêm.</div>
                  )}
                </div>
              </div>

              {/* Bottom Save Action Bar */}
              <div className="editor-bottom-save-bar">
                <button
                  type="button"
                  className="btn-admin-save btn-bottom-save"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Đang Lưu Dữ Liệu...' : 'Lưu Thay Đổi (Cập Nhật Toàn Bộ)'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-selection-empty">
              <Package size={48} />
              <p>Vui lòng chọn hoặc thêm một sản phẩm từ danh sách bên trái để bắt đầu chỉnh sửa.</p>
            </div>
          )}
        </main>

        {/* Right Column: Live Real-time Spotlight Preview */}
        <aside className="admin-live-preview-panel">
          <div className="preview-panel-header">
            <div className="preview-title-row">
              <Eye size={17} className="gold-icon" />
              <span className="preview-heading">Xem Trước Thực Tế</span>
            </div>
          </div>

          {selectedItem && (
            <div className="preview-card-wrap">
              {/* Product Media Card */}
              <div className="preview-stage-card">
                <div className="preview-img-box">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/b2b-showcase/tropical-fruits.jpg';
                    }}
                  />
                  <div className="preview-img-glow" />
                </div>
              </div>

              {/* Spotlight Content Spec Sheet */}
              <div className="preview-details-sheet">
                <div className="preview-badge-group">
                  <span className="verified-pill">
                    <ShieldCheck size={14} />
                    <span>Verified ISO/FDA Standard</span>
                  </span>
                  <span className="category-pill">{selectedItem.category}</span>
                </div>

                <h3 className="preview-product-title">{selectedItem.title}</h3>
                <p className="preview-product-sub">{selectedItem.subtitle}</p>
                <p className="preview-product-desc">{selectedItem.description}</p>

                {/* Highlights List */}
                {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                  <div className="preview-highlights-list">
                    {selectedItem.highlights.map((h, i) => (
                      <div key={i} className="preview-h-item">
                        <CheckCircle2 size={14} className="h-check" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Specs Grid */}
                <div className="preview-specs-grid">
                  <div className="preview-spec-cell">
                    <div className="spec-cell-head">
                      <Award size={13} />
                      <span>Tiêu chuẩn</span>
                    </div>
                    <span className="spec-cell-val">{selectedItem.standards || '—'}</span>
                  </div>

                  <div className="preview-spec-cell">
                    <div className="spec-cell-head">
                      <Factory size={13} />
                      <span>Năng lực</span>
                    </div>
                    <span className="spec-cell-val val-gold">{selectedItem.capacity || '—'}</span>
                  </div>

                  <div className="preview-spec-cell">
                    <div className="spec-cell-head">
                      <Globe2 size={13} />
                      <span>Thị trường</span>
                    </div>
                    <span className="spec-cell-val">{selectedItem.markets || '—'}</span>
                  </div>

                  <div className="preview-spec-cell">
                    <div className="spec-cell-head">
                      <Package size={13} />
                      <span>Quy cách</span>
                    </div>
                    <span className="spec-cell-val">{selectedItem.packaging || '—'}</span>
                  </div>
                </div>

                {/* Mock RFQ Button */}
                <button type="button" className="preview-mock-rfq" disabled>
                  <span>Yêu Cầu Báo Giá RFQ (Xem trước)</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
