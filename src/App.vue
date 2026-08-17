<template>
  <div id="app-root" class="qualification-app" @keyup.esc="closeOverlays">
    <header class="global-topbar">
      <div class="platform-brand" aria-label="绩效管理平台">
        <img src="./assets/qualification/platform-mark.svg" alt="" />
        <span><em>绩效</em>管理平台</span>
      </div>

      <div class="account-area">
        <button
          class="account-button"
          type="button"
          :aria-expanded="profileOpen ? 'true' : 'false'"
          aria-haspopup="menu"
          @click="profileOpen = !profileOpen"
        >
          <span class="account-avatar">
            <img src="./assets/qualification/avatar-bg.svg" alt="" />
            <b>刘</b>
          </span>
          <span class="account-copy">
            <strong>刘润鑫</strong>
            <small>123456789</small>
          </span>
          <img src="./assets/qualification/account-arrow.svg" alt="" />
        </button>
        <div v-if="profileOpen" class="profile-menu" role="menu">
          <button type="button" role="menuitem" @click="notify('个人中心功能待接入')">个人中心</button>
          <button type="button" role="menuitem" @click="notify('账号设置功能待接入')">账号设置</button>
        </div>
      </div>
    </header>

    <div class="application-body">
      <aside class="primary-sidebar">
        <nav aria-label="主导航">
          <button class="primary-nav-item active" type="button" aria-current="page">
            <img src="./assets/nav-icons/docs/active.svg" alt="" />
            <span>任职资格管理</span>
          </button>
        </nav>
        <img class="sidebar-watermark" src="./assets/qualification/pic2.png" alt="" />
      </aside>

      <main class="main-workspace">
        <section ref="modelBanner" class="model-banner" :style="modelBannerStyle" aria-label="任职资格模型">
          <img class="banner-pattern" src="./assets/qualification/pic2.png" alt="" />
          <span
            class="banner-info-card"
            :class="{
              'is-visible': infoBubbleVisible,
              'is-hiding': infoBubbleHiding
            }"
            aria-hidden="true"
          >
            <span class="banner-bubble-float-layer">
              <img src="./assets/qualification/人信息.svg" alt="" />
            </span>
          </span>
          <span
            class="banner-pass-badge"
            :class="{
              'is-visible': checkmarkBubbleVisible,
              'is-hiding': checkmarkBubbleHiding
            }"
            aria-hidden="true"
          >
            <span class="banner-bubble-float-layer">
              <span ref="checkmarkLottie" class="banner-checkmark-lottie"></span>
            </span>
          </span>
          <div class="banner-people">
            <img src="./assets/qualification/pic1.png" alt="任职资格管理人员插画" />
            <span class="blink-eye man-eye-left" aria-hidden="true"></span>
            <span class="blink-eye man-eye-right" aria-hidden="true"></span>
            <span class="blink-eye woman-eye-left" aria-hidden="true"></span>
            <span class="blink-eye woman-eye-right" aria-hidden="true"></span>
          </div>

          <div
            class="model-journey"
            :class="{ expanded: activeModelPreview }"
            @mouseleave="clearModelStagePreview"
          >
            <div class="journey-rail" aria-hidden="true"></div>
            <img
              class="journey-title"
              src="./assets/qualification/任职资格文字.svg"
              alt="任职资格模型"
            />
            <div
              v-for="stage in modelStages"
              :key="stage.key"
              class="journey-stage"
              :class="stage.key"
              @mouseenter="setModelStagePreview(stage.key)"
            >
              <span>{{ stage.lineOne }}</span>
              <span>{{ stage.lineTwo }}</span>
            </div>
            <transition name="journey-info">
              <aside
                v-if="activeModelPreview"
                :key="activeModelPreview.key"
                class="journey-info-card"
                :class="activeModelPreview.key"
                aria-live="polite"
              >
                <div class="journey-info-tags" aria-label="模块内容">
                  <span
                    v-for="item in activeModelPreview.tags"
                    :key="item"
                  >
                    {{ item }}
                  </span>
                </div>
                <p>{{ activeModelPreview.description }}</p>
              </aside>
            </transition>
          </div>
        </section>

        <div ref="contentStage" class="content-stage" :class="{ 'is-pinned': isContentStagePinned }">
          <aside ref="familyPanel" class="family-panel" aria-label="职群列表" @wheel="handleFamilyWheel">
            <div class="family-list">
              <button
                v-for="family in familyCards"
                :key="family.label"
                class="family-card"
                :class="{ active: highlightedFamily === family.label }"
                type="button"
                :aria-current="highlightedFamily === family.label ? 'true' : null"
                @click="selectFamily(family)"
              >
                <span>{{ family.label }}</span>
                <span class="family-visual" aria-hidden="true">
                  <img :src="family.image" :alt="`${family.label}职群`" />
                </span>
              </button>
            </div>
          </aside>

          <section ref="qualificationDetail" class="qualification-detail" @wheel="handleDetailWheel">
            <div class="detail-title-row">
              <h1>{{ selectedFamily }}</h1>
              <div
                class="detail-actions create-template-actions"
              >
                <button
                  type="button"
                  class="create-template-action"
                  :class="{ 'is-downloading': isExportDownloading }"
                  :disabled="isExportDownloading"
                  :aria-busy="isExportDownloading ? 'true' : 'false'"
                  @click="exportTable"
                >
                  <img src="./assets/action-icons/download.svg" alt="" />
                  <span :hidden="isExportDownloading">导出表格</span>
                  <span
                    class="create-template-progress"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :aria-valuenow="Math.round(exportDownloadProgress)"
                    :hidden="!isExportDownloading"
                  >
                    <span class="create-template-progress-track">
                      <span
                        class="create-template-progress-bar"
                        :style="{ width: `${exportDownloadProgress}%` }"
                      ></span>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <section class="field-overview">
              <div class="field-row">
                <h2>专业领域：</h2>
                <div class="field-content">
                  <div ref="fieldPills" class="field-pills" role="list" aria-label="专业领域">
                    <span
                      ref="fieldPillIndicator"
                      class="field-pill-indicator"
                      :style="fieldPillIndicatorStyle"
                      aria-hidden="true"
                    ></span>
                    <button
                      v-for="field in selectedFamilyFields"
                      :key="field"
                      ref="fieldPillButtons"
                      class="field-pill"
                      :class="{ active: selectedField === field }"
                      type="button"
                      :aria-pressed="selectedField === field ? 'true' : 'false'"
                      @click="selectField(field)"
                    >
                      <span class="field-pill-label">{{ field }}</span>
                    </button>
                  </div>
                  <p class="field-description">{{ currentDescription }}</p>
                </div>
              </div>

              <div class="positions-row">
                <h2>包含岗位：</h2>
                <div class="position-tags" role="list" aria-label="包含岗位">
                  <template v-if="currentPositions.length">
                    <span
                      v-for="position in currentPositions"
                      :key="position"
                      role="listitem"
                    >
                      {{ position }}
                    </span>
                  </template>
                  <span v-else class="empty-position-tag" role="listitem">待接入对应表格</span>
                </div>
              </div>
            </section>

            <div
              ref="tabList"
              class="detail-tabs"
              role="tablist"
              aria-label="任职资格模块"
            >
              <button
                v-for="(tab, index) in tabs"
                :key="tab.key"
                ref="tabButtons"
                :id="`tab-${tab.key}`"
                type="button"
                role="tab"
                :aria-selected="activeTab === tab.key ? 'true' : 'false'"
                :aria-controls="`panel-${tab.key}`"
                :tabindex="activeTab === tab.key ? 0 : -1"
                :class="{ active: activeTab === tab.key }"
                @click="selectTab(tab.key)"
                @keydown="handleTabKeydown($event, index)"
              >
                {{ tab.label }}
              </button>
              <span class="tab-indicator" :style="tabIndicatorStyle" aria-hidden="true"></span>
            </div>

            <div ref="detailScrollRegion" class="detail-scroll-region">
              <transition :name="tabTransitionName" mode="out-in" @before-enter="handleMainPanelBeforeEnter">
                <section
                  v-if="activeTab === 'basic'"
                  id="panel-basic"
                  :key="`basic-${detailIntroAnimationKey}`"
                  class="basic-panel"
                  role="tabpanel"
                  aria-labelledby="tab-basic"
                >
                  <template>
                    <div :key="`level-grid-${detailIntroAnimationKey}`" class="level-grid">
                      <article
                        v-for="(level, index) in levelSummaries"
                        :key="level.title"
                        class="level-summary-card"
                        :style="{ '--level-card-index': index }"
                      >
                        <div class="level-heading">
                          <img src="./assets/qualification/title-line-left.svg" alt="" />
                          <h3>{{ level.title }}</h3>
                          <img src="./assets/qualification/title-line-right.svg" alt="" />
                        </div>
                        <dl>
                          <div>
                            <dt>职级：</dt>
                            <dd>{{ level.grades }}</dd>
                          </div>
                          <div>
                            <dt>工作年限：</dt>
                            <dd>{{ level.workYears }}</dd>
                          </div>
                          <div>
                            <dt>职级年限：</dt>
                            <dd>{{ level.gradeYears }}</dd>
                          </div>
                          <div>
                            <dt>职称要求：</dt>
                            <dd :class="{ emphasized: level.titleRequirement !== '-' }">
                              {{ level.titleRequirement }}
                            </dd>
                          </div>
                          <div>
                            <dt>绩效要求：</dt>
                            <dd>{{ level.performance }}</dd>
                          </div>
                        </dl>
                      </article>
                    </div>

                    <div
                      :key="`notes-${detailIntroAnimationKey}`"
                      class="notes-block detail-intro-block"
                    >
                      <div class="notes-title"><span></span><h3>说明：</h3></div>
                      <p v-for="note in notes" :key="note.before">
                        <span>{{ note.before }}</span><strong v-if="note.emphasis">{{ note.emphasis }}</strong><span>{{ note.after }}</span>
                      </p>
                    </div>
                  </template>

                </section>

                <section
                  v-else-if="activeTab === 'professional'"
                  id="panel-professional"
                  key="professional"
                  class="professional-panel"
                  role="tabpanel"
                  aria-labelledby="tab-professional"
                  @wheel="handleProfessionalPanelWheel"
                >
                  <nav class="professional-subnav" role="tablist" aria-label="专业能力内容">
                    <button
                      v-for="(section, index) in professionalSections"
                      :key="section.key"
                      ref="professionalSectionButtons"
                      :id="`professional-section-${section.key}`"
                      type="button"
                      role="tab"
                      :class="{ active: activeProfessionalSection === section.key }"
                      :aria-selected="activeProfessionalSection === section.key ? 'true' : 'false'"
                      :aria-controls="`professional-content-${section.key}`"
                      :tabindex="activeProfessionalSection === section.key ? 0 : -1"
                      @click="selectProfessionalSection(section.key)"
                      @keydown="handleProfessionalSectionKeydown($event, index)"
                    >
                      {{ section.label }}
                    </button>
                  </nav>

                  <div
                    ref="professionalContent"
                    class="professional-content detail-intro-block"
                    :class="{
                      'is-local-scroll-content': activeProfessionalSection === 'skills'
                        || activeProfessionalSection === 'results'
                    }"
                  >
                    <transition name="professional-content" mode="out-in" @before-enter="handleProfessionalContentBeforeEnter">
                      <section
                        v-if="activeProfessionalSection === 'knowledge'"
                        id="professional-content-knowledge"
                        key="knowledge"
                        class="professional-knowledge"
                        role="tabpanel"
                        aria-labelledby="professional-section-knowledge"
                      >
                        <template>
                          <h2>专业知识</h2>
                          <ul>
                          <li v-for="(item, index) in currentProfessionalKnowledge" :key="item">
                            <img src="./assets/qualification/professional-bullet.svg" alt="" />
                            <p>{{ formatTextWithPunctuation(item, index, currentProfessionalKnowledge.length) }}</p>
                          </li>
                          </ul>
                        </template>
                      </section>

                      <section
                        v-else-if="activeProfessionalSection === 'skills'"
                        id="professional-content-skills"
                        key="skills"
                        class="professional-skills"
                        role="tabpanel"
                        aria-labelledby="professional-section-skills"
                      >
                        <template>
                          <div class="professional-skill-overview">
                            <div ref="professionalSkillPills" class="professional-skill-pills" role="tablist" aria-label="专业技能分类">
                              <span
                                class="professional-skill-indicator"
                                :style="professionalSkillIndicatorStyle"
                                aria-hidden="true"
                              ></span>
                              <button
                                v-for="ability in currentProfessionalAbilities"
                                :key="ability.name"
                                ref="professionalSkillButtons"
                                type="button"
                                role="tab"
                                :class="{ active: selectedProfessionalAbility === ability.name }"
                                :aria-selected="selectedProfessionalAbility === ability.name ? 'true' : 'false'"
                                @click="selectProfessionalAbility(ability.name)"
                              >
                                <span>{{ ability.name }}</span>
                              </button>
                            </div>
                            <p>{{ currentProfessionalAbility.description }}</p>
                          </div>

                          <div ref="professionalSkillScroll" class="professional-skill-scroll">
                            <transition name="professional-ability" mode="out-in">
                              <div :key="selectedProfessionalAbility" class="professional-skill-levels">
                                <article
                                  v-for="level in currentProfessionalBehavior.levels"
                                  :key="level.level"
                                  class="professional-skill-level"
                                >
                                  <header>
                                    <img :src="professionalLevelIcons[level.level]" alt="" />
                                    <h3>{{ level.label }}</h3>
                                  </header>
                                  <div>
                                    <p v-for="(item, index) in level.items" :key="`${level.level}-${index}`">
                                    {{ formatProfessionalLevelItem(item, index, level.items) }}
                                    </p>
                                  </div>
                                </article>
                              </div>
                            </transition>
                          </div>
                        </template>
                      </section>

                      <section
                        v-else
                        id="professional-content-results"
                        key="results"
                        class="professional-results"
                        role="tabpanel"
                        aria-labelledby="professional-section-results"
                      >
                        <template>
                          <div ref="outcomeGradePills" class="outcome-grade-pills" role="tablist" aria-label="职级结果要求">
                            <span
                              class="outcome-grade-indicator"
                              :style="outcomeGradeIndicatorStyle"
                              aria-hidden="true"
                            ></span>
                            <button
                              v-for="(outcome, index) in currentOutcomes"
                              :key="outcome.grade"
                              ref="outcomeGradeButtons"
                              type="button"
                              role="tab"
                              :class="{ active: selectedOutcomeGrade === outcome.grade }"
                              :aria-selected="selectedOutcomeGrade === outcome.grade ? 'true' : 'false'"
                              @click="selectOutcomeGrade(outcome.grade)"
                              @keydown="handleOutcomeGradeKeydown($event, index)"
                            >
                              <span>{{ outcome.grade }}</span>
                            </button>
                          </div>

                          <div ref="outcomeScroll" class="outcome-scroll">
                            <transition name="outcome-content" mode="out-in">
                              <div :key="selectedOutcomeGrade" class="outcome-content">
                                <div class="outcome-requirements">
                                  <ol>
                                    <li v-for="(item, index) in currentOutcome.items" :key="`${selectedOutcomeGrade}-${index}`">
                                      <template v-for="(segment, segmentIndex) in getOutcomeSegments(item, index)">
                                        <strong v-if="segment.emphasized" :key="`strong-${segmentIndex}`">{{ segment.text }}</strong>
                                        <span v-else :key="`text-${segmentIndex}`">{{ segment.text }}</span>
                                      </template>
                                    </li>
                                  </ol>
                                  <p class="outcome-minimum">※ 以上满足{{ currentOutcome.minimum }}条即可。</p>
                                </div>

                                <section class="outcome-ability-section">
                                  <h2>对应专业能力层级</h2>
                                  <div class="outcome-ability-table-wrap">
                                    <table>
                                      <thead>
                                        <tr>
                                          <th v-for="item in currentOutcome.abilityLevels" :key="item.ability" scope="col">
                                            {{ item.ability }}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td v-for="item in currentOutcome.abilityLevels" :key="item.ability">
                                            {{ item.level }}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </section>
                              </div>
                            </transition>
                          </div>
                        </template>
                      </section>
                    </transition>
                  </div>
                </section>

                <section
                  v-else
                  id="panel-general"
                  key="general"
                  class="general-panel"
                  role="tabpanel"
                  aria-labelledby="tab-general"
                >
                  <div
                    ref="generalCompetencyTableWrap"
                    class="general-competency-table-wrap detail-intro-block"
                    @wheel="handleGeneralPanelWheel"
                  >
                    <table class="general-competency-table">
                      <colgroup>
                        <col class="dimension-column" />
                        <col class="element-column" />
                        <col />
                      </colgroup>
                      <thead>
                        <tr>
                          <th scope="col">测评维度</th>
                          <th scope="col">测评要素</th>
                          <th scope="col">要素解析</th>
                        </tr>
                      </thead>
                      <tbody
                        v-for="group in generalCompetencyGroups"
                        :key="group.dimension"
                      >
                        <tr
                          v-for="(item, itemIndex) in group.items"
                          :key="`${group.dimension}-${item.element}`"
                        >
                          <th
                            v-if="itemIndex === 0"
                            class="dimension-cell"
                            scope="rowgroup"
                            :rowspan="group.items.length"
                          >
                            {{ group.dimension }}
                          </th>
                          <th class="element-cell" scope="row">{{ item.element }}</th>
                          <td class="analysis-cell">{{ item.analysis }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </transition>
            </div>
          </section>
        </div>
      </main>
    </div>

    <transition name="toast">
      <div v-if="toastMessage" class="status-toast" role="status">
        <span>{{ toastMessage }}</span>
        <button type="button" aria-label="关闭提示" @click="toastMessage = ''">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import lottie from "lottie-web";
import { qualificationData } from "./data/qualificationData";
import checkmarkAnimationData from "./assets/qualification/checkmark.json";

export default {
  name: "App",
  data() {
    const familyCards = [
      { label: "市场营销", dataFamily: "市场营销", image: require("./assets/qualification/市场营销.png") },
      { label: "研发", dataFamily: "研发", image: require("./assets/qualification/研发.png") },
      { label: "生成制造", dataFamily: "生产制造", image: require("./assets/qualification/生成制造.png") },
      { label: "供应链", dataFamily: "供应链", image: require("./assets/qualification/供应链.png") },
      { label: "品质", dataFamily: "品质", image: require("./assets/qualification/品质.png") },
      { label: "物流", dataFamily: "物流", image: require("./assets/qualification/物流.png") },
      { label: "财务", dataFamily: "财务", image: require("./assets/qualification/财务.png") },
      { label: "人力资源", dataFamily: "人力资源", image: require("./assets/qualification/人力资源.png") },
      { label: "战略运营", dataFamily: "战略运营", image: require("./assets/qualification/战略运营.png") },
      { label: "法务", dataFamily: "法务", image: require("./assets/qualification/法务.png") },
      { label: "行政支持", dataFamily: "行政支持", image: require("./assets/qualification/行政支持.png") },
      { label: "金融", dataFamily: "金融", image: require("./assets/qualification/金融.png") },
      { label: "信息技术", dataFamily: "信息技术", image: require("./assets/qualification/信息技术.png") },
      { label: "电商业务", dataFamily: "电商业务", image: require("./assets/qualification/电商业务.png") }
    ];
    const defaultFamily = familyCards[0];
    const defaultField = (
      qualificationData.standardMap.find((item) => item.family === defaultFamily.dataFamily)?.fields[0]
      || qualificationData.meta.field
    );

    return {
      data: qualificationData,
      selectedFamily: defaultFamily.label,
      selectedDataFamily: defaultFamily.dataFamily,
      highlightedFamily: defaultFamily.label,
      selectedField: defaultField,
      activeProfessionalSection: "knowledge",
      selectedProfessionalAbility: "规划统筹",
      selectedOutcomeGrade: "19",
      activeTab: "basic",
      tabTransitionName: "tab-forward",
      tabIndicatorStyle: {
        width: "0px",
        transform: "translateX(0px)"
      },
      fieldPillIndicatorStyle: {
        width: "0px",
        height: "30px",
        opacity: 0,
        transform: "translate3d(0, 0, 0)"
      },
      professionalSkillIndicatorStyle: {
        width: "0px",
        height: "36px",
        opacity: 0,
        transform: "translate3d(0, 0, 0)"
      },
      outcomeGradeIndicatorStyle: {
        width: "0px",
        height: "36px",
        opacity: 0,
        transform: "translate3d(0, 0, 0)"
      },
      profileOpen: false,
      toastMessage: "",
      toastTimer: null,
      isExportDownloading: false,
      exportDownloadProgress: 0,
      modelBannerProgress: 0,
      modelBannerFrame: null,
      hoveredModelStage: null,
      detailIntroAnimationKey: 0,
      checkmarkAnimation: null,
      infoBubbleVisible: false,
      infoBubbleHiding: false,
      checkmarkBubbleVisible: false,
      checkmarkBubbleHiding: false,
      bannerBubbleTimers: [],
      modelStages: [
        {
          key: "basic",
          lineOne: "基本",
          lineTwo: "条件",
          tags: ["学历", "工龄", "绩效", "工作经验"],
          description: "基本条件是门槛，原则上不满足条件则无法满足职级、职序晋升。"
        },
        {
          key: "professional",
          lineOne: "专业",
          lineTwo: "能力",
          tags: ["知识", "技能", "专业成果产出"],
          description: "专业能力作为重点衡量依据，一方面建立未来对标方面，一方面作为当前晋升标准，在专业成果产出方面，基于最终结果产出为导向，牵引员工的工作方向，明确目标。"
        },
        {
          key: "general",
          lineOne: "通用",
          lineTwo: "能力",
          tags: ["通用能力"],
          description: "能力要求是衡量未来晋升准备度的重要参考，可衡量现有员工与下一职级能力要求的匹配度，牵引员工提升个人能力。"
        }
      ],
      tabs: [
        { key: "basic", label: "基本条件" },
        { key: "professional", label: "专业能力" },
        { key: "general", label: "通用能力" }
      ],
      professionalSections: [
        { key: "knowledge", label: "专业知识" },
        { key: "skills", label: "专业技能" },
        { key: "results", label: "专业结果产出" }
      ],
      professionalLevelIcons: {
        4: require("./assets/qualification/professional-level-4.svg"),
        3: require("./assets/qualification/professional-level-3.svg"),
        2: require("./assets/qualification/professional-level-2.svg"),
        1: require("./assets/qualification/professional-level-1.svg")
      },
      familyCards,
      levelSummaries: [
        {
          title: "高级专员",
          grades: "17、18、19",
          workYears: "8~12年",
          gradeYears: "上一职级工作经验不少于1年",
          titleRequirement: "高级职称",
          performance: "近一年绩效为SA"
        },
        {
          title: "中级专员",
          grades: "14、15、16",
          workYears: "5~8年",
          gradeYears: "上一职级工作经验不少于1年",
          titleRequirement: "中级职称",
          performance: "近一年绩效为SA"
        },
        {
          title: "初级专员",
          grades: "12、13",
          workYears: "2~5年",
          gradeYears: "上一职级工作经验不少于1年",
          titleRequirement: "初级职称",
          performance: "近一年绩效为SA"
        },
        {
          title: "助理",
          grades: "11",
          workYears: "0~2年",
          gradeYears: "-",
          titleRequirement: "-",
          performance: "-"
        }
      ],
      notes: [
        { before: "1.任职资格应基于战略要求定义未来的人，而非基于人员现状制定的标准，制定标准时需考虑标准的牵引性作用;", after: "" },
        { before: "2.职级20-25级，本表无需填写;", after: "" },
        { before: "3.专业，按照岗位任职要求填写，专业需与高校所开设专业对应;", after: "" },
        { before: "4.工作年限，参照集团所列基本要求，可根据岗位任职要求，可", emphasis: "高于", after: "集团所列基本要求标准;" },
        { before: "5.职称要求，在满足集团所列基本要求的前提下，需", emphasis: "明确职称的具体专业领域", after: "，比如经济师(人力资源)、工程师(机电);" },
        { before: "6.绩效要求，按照集团所列基本要求执行;", after: "" }
      ]
    };
  },
  computed: {
    selectedFamilyFields() {
      const match = this.data.standardMap.find((item) => item.family === this.selectedDataFamily);
      return match ? match.fields : [];
    },
    hasCurrentStandard() {
      return this.selectedDataFamily === this.data.meta.family
        && this.selectedField === this.data.meta.field;
    },
    demoStandard() {
      const field = this.selectedField || "综合管理";
      const family = this.selectedFamily || "当前职群";
      const abilityNames = [
        "规划统筹",
        "流程标准",
        "项目交付",
        "数据分析",
        "协同推进",
        "风险管控"
      ];
      const professionalAbilities = abilityNames.map((name) => ({
        name,
        description: `围绕${field}的${name}能力进行演示配置，覆盖目标拆解、过程推进、跨部门协同与结果复盘，后续可替换为对应来源表格。`
      }));
      const behaviorLevels = professionalAbilities.map((ability) => ({
        ability: ability.name,
        levels: [
          {
            level: "4",
            label: "解决方案提供者",
            items: [
              `主导${family}${field}领域关键机制建设，形成可复制的解决方案并推动落地`,
              `统筹跨部门资源，解决复杂业务场景下的${field}重点问题`,
              `沉淀${field}方法论、模板与评价标准，支持多团队复用`
            ]
          },
          {
            level: "3",
            label: "能手",
            items: [
              `独立承接${field}专项任务，能够识别关键问题并提出可执行方案`,
              `协调业务、职能及相关方推进计划，保障过程质量与结果达成`,
              `结合数据与反馈优化执行策略，形成阶段性复盘结论`
            ]
          },
          {
            level: "2",
            label: "独立应用",
            items: [
              `按照既定流程独立完成${field}日常管理与专项支持工作`,
              `能够整理基础数据、跟进任务节点，并输出规范记录`,
              `发现常规问题后可提出改善建议，并在指导下推进优化`
            ]
          },
          {
            level: "1",
            label: "指导下应用",
            items: [
              `在指导下完成${field}基础资料整理、信息维护与流程跟进`,
              `配合完成会议组织、数据收集、文件归档等支撑工作`,
              `按照标准模板输出基础记录，保证信息准确完整`
            ]
          }
        ]
      }));
      const outcomeAbilityLevels = (levels) => professionalAbilities.map((ability, index) => ({
        ability: ability.name,
        level: `${levels[index]}`
      }));
      const outcomeSpecs = [
        { grade: "19", minimum: "4", levels: [4, 4, 4, 4, 4, 4], count: "集团级", scope: "战略级", quantity: "至少2项" },
        { grade: "18", minimum: "4", levels: [3, 4, 4, 4, 3, 4], count: "集团/事业群级", scope: "体系级", quantity: "至少1项" },
        { grade: "17", minimum: "4", levels: [3, 4, 3, 4, 3, 4], count: "事业群级", scope: "专项级", quantity: "至少1项" },
        { grade: "16", minimum: "3", levels: [3, 3, 3, 3, 3, 3], count: "部门级", scope: "重点专项", quantity: "至少1项" },
        { grade: "15", minimum: "3", levels: [2, 3, 3, 3, 2, 2], count: "部门级", scope: "执行专项", quantity: "至少2项" },
        { grade: "14", minimum: "3", levels: [2, 2, 2, 3, 2, 2], count: "模块级", scope: "常规专项", quantity: "至少2项" },
        { grade: "13", minimum: "3", levels: [1, 2, 2, 2, 1, 2], count: "模块级", scope: "基础专项", quantity: "至少1项" },
        { grade: "12", minimum: "2", levels: [1, 2, 2, 2, 1, 2], count: "岗位级", scope: "基础工作", quantity: "不少于3次" },
        { grade: "11", minimum: "2", levels: [1, 1, 1, 1, 1, 1], count: "岗位级", scope: "辅助工作", quantity: "不少于2次" }
      ];

      return {
        definition: `围绕${family}${field}岗位职责、工作经验、专业能力与通用能力，建立统一、清晰且可持续维护的任职资格演示标准。`,
        positions: [
          `${field}经理`,
          `${field}专员`,
          `${field}支持岗`
        ],
        professionalKnowledge: [
          `熟悉${field}领域的基础理论、管理流程、业务边界与常用工具方法`,
          `掌握${field}相关制度规范、数据分析方法、项目推进机制与风险识别要点`,
          `了解${family}业务协同场景，能够结合组织目标形成专业判断与改善建议`
        ],
        professionalAbilities,
        behaviorLevels,
        outcomes: outcomeSpecs.map((spec) => ({
          grade: spec.grade,
          minimum: spec.minimum,
          items: [
            `主导或参与完成${spec.count}${field}${spec.scope}项目${spec.quantity}，输出方案并推动落地，获得相关方认可`,
            `围绕${field}关键目标建立计划、过程跟踪与复盘机制，保障任务按期达成并形成可持续成果`,
            `基于业务数据、流程问题与相关方反馈，提出${field}优化建议并完成闭环改善`,
            `协同上下游团队处理${field}跨部门事项，明确责任边界、推进路径与交付标准`,
            `沉淀${field}工作模板、案例或操作指引，支持团队后续复制应用`
          ],
          abilityLevels: outcomeAbilityLevels(spec.levels)
        })),
        generalCompetencies: this.data.generalCompetencies
      };
    },
    currentProfessionalKnowledge() {
      return this.hasCurrentStandard ? this.data.professionalKnowledge : this.demoStandard.professionalKnowledge;
    },
    currentProfessionalAbilities() {
      return this.hasCurrentStandard ? this.data.professionalAbilities : this.demoStandard.professionalAbilities;
    },
    currentBehaviorLevels() {
      return this.hasCurrentStandard ? this.data.behaviorLevels : this.demoStandard.behaviorLevels;
    },
    currentOutcomes() {
      return this.hasCurrentStandard ? this.data.outcomes : this.demoStandard.outcomes;
    },
    currentGeneralCompetencies() {
      return this.hasCurrentStandard ? this.data.generalCompetencies : this.demoStandard.generalCompetencies;
    },
    currentDescription() {
      if (this.hasCurrentStandard) {
        return this.data.meta.definition;
      }
      return this.demoStandard.definition;
    },
    currentPositions() {
      if (this.hasCurrentStandard) {
        return this.data.meta.positions;
      }
      return this.demoStandard.positions;
    },
    activeProfessionalSectionLabel() {
      const section = this.professionalSections.find((item) => item.key === this.activeProfessionalSection);
      return section ? section.label : "";
    },
    currentProfessionalAbility() {
      return this.currentProfessionalAbilities.find((item) => item.name === this.selectedProfessionalAbility)
        || this.currentProfessionalAbilities[0]
        || { name: "", description: "" };
    },
    currentProfessionalBehavior() {
      return this.currentBehaviorLevels.find((item) => item.ability === this.selectedProfessionalAbility)
        || this.currentBehaviorLevels[0]
        || { ability: "", levels: [] };
    },
    currentOutcome() {
      return this.currentOutcomes.find((item) => item.grade === this.selectedOutcomeGrade)
        || this.currentOutcomes[0]
        || { grade: "", minimum: "", items: [], abilityLevels: [] };
    },
    generalCompetencyGroups() {
      const displayedDimensions = ["敢担当", "善作为", "守纪律"];
      return displayedDimensions.map((dimension) => ({
        dimension,
        items: this.currentGeneralCompetencies.filter((item) => item.dimension === dimension)
      }));
    },
    currentOutcomeHighlights() {
      if (!this.hasCurrentStandard || !this.data.outcomeHighlights) return {};
      return this.data.outcomeHighlights;
    },
    modelBannerStyle() {
      const opacity = Math.max(0, Math.min(1, 1 - this.modelBannerProgress));
      return {
        opacity,
        pointerEvents: opacity <= 0.001 ? "none" : "auto",
        visibility: opacity <= 0.001 ? "hidden" : "visible"
      };
    },
    isContentStagePinned() {
      return this.modelBannerProgress >= 1;
    },
    activeModelPreview() {
      if (!this.hoveredModelStage) return null;
      return this.modelStages.find((stage) => stage.key === this.hoveredModelStage) || null;
    }
  },
  mounted() {
    this.prepareInitialScrollPosition();
    this.$nextTick(() => {
      this.resetScrollPositions();
      this.updateTabIndicator();
      this.updateFieldPillIndicator();
      this.updateModelBannerProgress();
      this.initCheckmarkLottie();
      window.requestAnimationFrame(() => {
        this.resetScrollPositions();
        this.updateModelBannerProgress();
      });
    });
    window.addEventListener("scroll", this.requestModelBannerProgress, { passive: true });
    window.addEventListener("resize", this.updateTabIndicator);
    window.addEventListener("resize", this.updateFieldPillIndicator);
    window.addEventListener("resize", this.updateProfessionalSkillIndicator);
    window.addEventListener("resize", this.updateOutcomeGradeIndicator);
    window.addEventListener("resize", this.updateModelBannerProgress);
  },
  beforeDestroy() {
    window.clearTimeout(this.toastTimer);
    if (this.modelBannerFrame) {
      window.cancelAnimationFrame(this.modelBannerFrame);
    }
    this.destroyCheckmarkLottie();
    this.clearBannerBubbleTimers();
    window.removeEventListener("scroll", this.requestModelBannerProgress);
    window.removeEventListener("resize", this.updateTabIndicator);
    window.removeEventListener("resize", this.updateFieldPillIndicator);
    window.removeEventListener("resize", this.updateProfessionalSkillIndicator);
    window.removeEventListener("resize", this.updateOutcomeGradeIndicator);
    window.removeEventListener("resize", this.updateModelBannerProgress);
  },
  methods: {
    initCheckmarkLottie() {
      this.destroyCheckmarkLottie();

      const container = this.$refs.checkmarkLottie;
      if (!container) return;

      this.checkmarkAnimation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: checkmarkAnimationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      });

      this.checkmarkAnimation.addEventListener("complete", this.handleCheckmarkLottieComplete);
      this.startBannerBubbleSequence();
    },
    startBannerBubbleSequence() {
      this.clearBannerBubbleTimers();
      this.infoBubbleVisible = false;
      this.infoBubbleHiding = false;
      this.checkmarkBubbleVisible = false;
      this.checkmarkBubbleHiding = false;

      if (this.checkmarkAnimation) {
        this.checkmarkAnimation.stop();
      }

      this.setBannerBubbleTimer(() => {
        this.infoBubbleVisible = true;
      }, 120);

      this.setBannerBubbleTimer(this.playCheckmarkBubble, 690);
    },
    setBannerBubbleTimer(callback, delay) {
      const timer = window.setTimeout(() => {
        this.bannerBubbleTimers = this.bannerBubbleTimers.filter((item) => item !== timer);
        callback();
      }, delay);
      this.bannerBubbleTimers.push(timer);
    },
    clearBannerBubbleTimers() {
      this.bannerBubbleTimers.forEach((timer) => window.clearTimeout(timer));
      this.bannerBubbleTimers = [];
    },
    playCheckmarkBubble() {
      if (!this.checkmarkAnimation) return;

      this.checkmarkBubbleHiding = false;
      this.checkmarkBubbleVisible = true;
      this.$nextTick(() => {
        this.checkmarkAnimation.goToAndPlay(0, true);
      });
    },
    handleCheckmarkLottieComplete() {
      this.clearBannerBubbleTimers();
      this.setBannerBubbleTimer(this.hideInfoBubble, 1500);
      this.setBannerBubbleTimer(this.hideCheckmarkBubble, 1740);
      this.setBannerBubbleTimer(this.startBannerBubbleSequence, 2900);
    },
    hideInfoBubble() {
      this.infoBubbleVisible = false;
      this.infoBubbleHiding = true;
      this.setBannerBubbleTimer(() => {
        this.infoBubbleHiding = false;
      }, 360);
    },
    hideCheckmarkBubble() {
      this.checkmarkBubbleVisible = false;
      this.checkmarkBubbleHiding = true;
      this.setBannerBubbleTimer(() => {
        this.checkmarkBubbleHiding = false;
      }, 360);
    },
    destroyCheckmarkLottie() {
      this.clearBannerBubbleTimers();
      this.infoBubbleVisible = false;
      this.infoBubbleHiding = false;
      this.checkmarkBubbleVisible = false;
      this.checkmarkBubbleHiding = false;
      if (!this.checkmarkAnimation) return;
      this.checkmarkAnimation.removeEventListener("complete", this.handleCheckmarkLottieComplete);
      this.checkmarkAnimation.destroy();
      this.checkmarkAnimation = null;
    },
    prepareInitialScrollPosition() {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    },
    resetScrollPositions() {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (this.$refs.familyPanel) {
        this.$refs.familyPanel.scrollTop = 0;
      }
      if (this.$refs.detailScrollRegion) {
        this.$refs.detailScrollRegion.scrollTop = 0;
      }
      if (this.$refs.qualificationDetail) {
        this.$refs.qualificationDetail.scrollTop = 0;
      }
      if (this.$refs.generalCompetencyTableWrap) {
        this.$refs.generalCompetencyTableWrap.scrollTop = 0;
      }
      if (this.$refs.professionalContent) {
        this.$refs.professionalContent.scrollTop = 0;
      }
      if (this.$refs.professionalSkillScroll) {
        this.$refs.professionalSkillScroll.scrollTop = 0;
      }
      if (this.$refs.outcomeScroll) {
        this.$refs.outcomeScroll.scrollTop = 0;
      }
      this.modelBannerProgress = 0;
    },
    setModelStagePreview(stageKey) {
      this.hoveredModelStage = stageKey;
    },
    clearModelStagePreview() {
      this.hoveredModelStage = null;
    },
    requestModelBannerProgress() {
      if (this.modelBannerFrame) return;
      this.modelBannerFrame = window.requestAnimationFrame(() => {
        this.modelBannerFrame = null;
        this.updateModelBannerProgress();
      });
    },
    updateModelBannerProgress() {
      const contentStage = this.$refs.contentStage;
      if (!contentStage) return;

      const topbar = document.querySelector(".global-topbar");
      const topbarHeight = topbar ? topbar.offsetHeight : 60;
      const pinnedTop = topbarHeight + 16;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const contentStageRect = contentStage.getBoundingClientRect();
      const contentStageDocumentTop = contentStageRect.top + scrollY;
      const fadeDistance = Math.max(contentStageDocumentTop - pinnedTop, 1);
      const progress = contentStageRect.top <= pinnedTop + 0.5
        ? 1
        : Math.min(Math.max(scrollY / fadeDistance, 0), 1);

      this.modelBannerProgress = progress;
    },
    handleDetailWheel(event) {
      const scrollRegion = this.$refs.detailScrollRegion;
      if (!this.shouldRouteContentWheel(event) || !scrollRegion) return;
      this.scrollPanelByWheel(scrollRegion, event);
    },
    handleFamilyWheel(event) {
      const familyPanel = this.$refs.familyPanel;
      if (!this.shouldRouteContentWheel(event) || !familyPanel) return;
      this.scrollPanelByWheel(familyPanel, event);
    },
    handleGeneralPanelWheel(event) {
      const generalPanel = this.$refs.generalCompetencyTableWrap;
      if (!this.shouldRouteContentWheel(event) || !generalPanel) return;
      if (!event.target.closest("tbody")) {
        const scrollRegion = this.$refs.detailScrollRegion;
        const didScroll = scrollRegion ? this.scrollPanelByWheel(scrollRegion, event, true) : false;
        if (!didScroll) {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (generalPanel.scrollHeight <= generalPanel.clientHeight) return;

      event.preventDefault();
      event.stopPropagation();
      const nextScrollTop = Math.min(
        Math.max(generalPanel.scrollTop + this.getNormalizedWheelDeltaY(event), 0),
        generalPanel.scrollHeight - generalPanel.clientHeight
      );
      generalPanel.scrollTop = nextScrollTop;
    },
    handleProfessionalPanelWheel(event) {
      const professionalScrollTarget = this.getProfessionalScrollTarget();
      if (!this.shouldRouteContentWheel(event) || !professionalScrollTarget) return;
      const didScroll = this.scrollPanelByWheel(professionalScrollTarget, event, true);
      if (!didScroll && professionalScrollTarget.scrollHeight > professionalScrollTarget.clientHeight) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    getProfessionalScrollTarget() {
      if (this.activeProfessionalSection === "skills" && this.$refs.professionalSkillScroll) {
        return this.$refs.professionalSkillScroll;
      }
      if (this.activeProfessionalSection === "results" && this.$refs.outcomeScroll) {
        return this.$refs.outcomeScroll;
      }
      return this.$refs.professionalContent;
    },
    shouldRouteContentWheel(event) {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return false;
      const contentStage = this.$refs.contentStage;
      if (!contentStage) return false;

      const topbar = document.querySelector(".global-topbar");
      const topbarHeight = topbar ? topbar.offsetHeight : 60;
      const pinnedTop = topbarHeight + 16;
      return contentStage.getBoundingClientRect().top <= pinnedTop + 0.5;
    },
    getNormalizedWheelDeltaY(event) {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    },
    scrollPanelByWheel(panel, event, shouldStopPropagation = false) {
      const maxScrollTop = panel.scrollHeight - panel.clientHeight;
      if (maxScrollTop <= 0) return false;

      const nextScrollTop = Math.min(
        Math.max(panel.scrollTop + this.getNormalizedWheelDeltaY(event), 0),
        maxScrollTop
      );
      if (nextScrollTop === panel.scrollTop) return false;

      event.preventDefault();
      if (shouldStopPropagation) {
        event.stopPropagation();
      }
      panel.scrollTop = nextScrollTop;
      return true;
    },
    syncCurrentStandardSelections() {
      const firstAbility = this.currentProfessionalAbilities[0];
      const hasSelectedAbility = this.currentProfessionalAbilities.some(
        (ability) => ability.name === this.selectedProfessionalAbility
      );
      if (!hasSelectedAbility) {
        this.selectedProfessionalAbility = firstAbility ? firstAbility.name : "";
      }

      const firstOutcome = this.currentOutcomes[0];
      const hasSelectedOutcome = this.currentOutcomes.some(
        (outcome) => outcome.grade === this.selectedOutcomeGrade
      );
      if (!hasSelectedOutcome) {
        this.selectedOutcomeGrade = firstOutcome ? firstOutcome.grade : "";
      }
    },
    selectFamily(family) {
      this.selectedFamily = family.label;
      this.selectedDataFamily = family.dataFamily;
      this.highlightedFamily = family.label;
      const match = this.data.standardMap.find((item) => item.family === family.dataFamily);
      this.selectedField = (match && match.fields[0]) || "综合管理";
      this.syncCurrentStandardSelections();
      if (this.activeTab === "basic") {
        this.tabTransitionName = "tab-forward";
        this.playDetailIntroAnimation();
      }
      this.selectTab("basic");
      this.$nextTick(this.updateFieldPillIndicator);
    },
    selectField(field) {
      if (field === this.selectedField) return;
      this.selectedField = field;
      this.syncCurrentStandardSelections();
      this.$nextTick(() => {
        this.updateFieldPillIndicator();
        this.updateProfessionalSkillIndicator();
        this.updateOutcomeGradeIndicator();
      });
    },
    selectProfessionalSection(sectionKey) {
      if (sectionKey === this.activeProfessionalSection) return;
      this.activeProfessionalSection = sectionKey;
      this.$nextTick(() => {
        this.resetProfessionalContentScroll();
        this.updateProfessionalSkillIndicator();
        this.updateOutcomeGradeIndicator();
      });
    },
    selectProfessionalAbility(abilityName) {
      if (abilityName === this.selectedProfessionalAbility) return;
      this.selectedProfessionalAbility = abilityName;
      this.$nextTick(() => {
        this.resetProfessionalContentScroll();
        this.updateProfessionalSkillIndicator();
      });
    },
    selectOutcomeGrade(grade) {
      if (grade === this.selectedOutcomeGrade) return;
      this.selectedOutcomeGrade = grade;
      this.$nextTick(() => {
        this.resetProfessionalContentScroll();
        this.updateOutcomeGradeIndicator();
      });
    },
    resetProfessionalContentScroll() {
      if (this.$refs.professionalContent) {
        this.$refs.professionalContent.scrollTop = 0;
      }
      if (this.$refs.professionalSkillScroll) {
        this.$refs.professionalSkillScroll.scrollTop = 0;
      }
      if (this.$refs.outcomeScroll) {
        this.$refs.outcomeScroll.scrollTop = 0;
      }
    },
    updateOutcomeGradeIndicator() {
      const gradeButtons = this.$refs.outcomeGradeButtons;
      if (!gradeButtons || !this.currentOutcomes.length) {
        this.outcomeGradeIndicatorStyle = { ...this.outcomeGradeIndicatorStyle, opacity: 0 };
        return;
      }

      const buttons = Array.isArray(gradeButtons) ? gradeButtons : [gradeButtons];
      const activeIndex = this.currentOutcomes.findIndex((outcome) => outcome.grade === this.selectedOutcomeGrade);
      const activeButton = buttons[activeIndex];
      if (!activeButton) {
        this.outcomeGradeIndicatorStyle = { ...this.outcomeGradeIndicatorStyle, opacity: 0 };
        return;
      }

      this.outcomeGradeIndicatorStyle = {
        width: `${activeButton.offsetWidth}px`,
        height: `${activeButton.offsetHeight}px`,
        opacity: 1,
        transform: `translate3d(${activeButton.offsetLeft}px, ${activeButton.offsetTop}px, 0)`
      };
    },
    hasTerminalPunctuation(text) {
      return /[。！？；;.!?]$/.test(`${text}`.trim());
    },
    formatTextWithPunctuation(text, index = 0, total = 1) {
      const value = `${text || ""}`.trim();
      if (!value || value === "/" || this.hasTerminalPunctuation(value)) return value;
      return `${value}${index < total - 1 ? "；" : "。"}`;
    },
    formatProfessionalLevelItem(item, index, items) {
      if (item === "/") return "_____";
      const total = Array.isArray(items) ? items.length : 1;
      return `${index + 1}.${this.formatTextWithPunctuation(item, index, total)}`;
    },
    getOutcomeSegments(item, index) {
      const formattedItem = this.formatTextWithPunctuation(item, index, this.currentOutcome.items.length);
      const gradeHighlights = this.currentOutcomeHighlights[this.selectedOutcomeGrade];
      const highlights = (gradeHighlights && gradeHighlights[index]) || [];
      if (!highlights.length) return [{ text: formattedItem, emphasized: false }];

      const ranges = highlights
        .map((highlight) => {
          const start = formattedItem.indexOf(highlight);
          return start === -1 ? null : {
            start,
            end: start + highlight.length
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.start - b.start)
        .reduce((result, range) => {
          const previous = result[result.length - 1];
          if (previous && range.start < previous.end) return result;
          result.push(range);
          return result;
        }, []);

      if (!ranges.length) return [{ text: formattedItem, emphasized: false }];

      const segments = [];
      let cursor = 0;
      ranges.forEach((range) => {
        if (range.start > cursor) {
          segments.push({
            text: formattedItem.slice(cursor, range.start),
            emphasized: false
          });
        }
        segments.push({
          text: formattedItem.slice(range.start, range.end),
          emphasized: true
        });
        cursor = range.end;
      });
      if (cursor < formattedItem.length) {
        segments.push({
          text: formattedItem.slice(cursor),
          emphasized: false
        });
      }
      return segments.filter((segment) => segment.text);
    },
    updateProfessionalSkillIndicator() {
      const skillButtons = this.$refs.professionalSkillButtons;
      if (!skillButtons || !this.currentProfessionalAbilities.length) {
        this.professionalSkillIndicatorStyle = { ...this.professionalSkillIndicatorStyle, opacity: 0 };
        return;
      }

      const buttons = Array.isArray(skillButtons) ? skillButtons : [skillButtons];
      const activeIndex = this.currentProfessionalAbilities.findIndex(
        (ability) => ability.name === this.selectedProfessionalAbility
      );
      const activeButton = buttons[activeIndex];
      if (!activeButton) {
        this.professionalSkillIndicatorStyle = { ...this.professionalSkillIndicatorStyle, opacity: 0 };
        return;
      }

      this.professionalSkillIndicatorStyle = {
        width: `${activeButton.offsetWidth}px`,
        height: `${activeButton.offsetHeight}px`,
        opacity: 1,
        transform: `translate3d(${activeButton.offsetLeft}px, ${activeButton.offsetTop}px, 0)`
      };
    },
    handleMainPanelBeforeEnter() {
      if (this.activeTab === "professional" && this.activeProfessionalSection === "skills") {
        this.$nextTick(this.updateProfessionalSkillIndicator);
      } else if (this.activeTab === "professional" && this.activeProfessionalSection === "results") {
        this.$nextTick(this.updateOutcomeGradeIndicator);
      }
    },
    handleProfessionalContentBeforeEnter() {
      if (this.activeProfessionalSection === "skills") {
        this.$nextTick(this.updateProfessionalSkillIndicator);
      } else if (this.activeProfessionalSection === "results") {
        this.$nextTick(this.updateOutcomeGradeIndicator);
      }
    },
    updateFieldPillIndicator() {
      const pillButtons = this.$refs.fieldPillButtons;
      if (!pillButtons) return;

      const buttons = Array.isArray(pillButtons) ? pillButtons : [pillButtons];
      const activeIndex = this.selectedFamilyFields.indexOf(this.selectedField);
      const activeButton = buttons[activeIndex];
      if (!activeButton) return;

      this.fieldPillIndicatorStyle = {
        width: `${activeButton.offsetWidth}px`,
        height: `${activeButton.offsetHeight}px`,
        opacity: 1,
        transform: `translate3d(${activeButton.offsetLeft}px, ${activeButton.offsetTop}px, 0)`
      };
    },
    playDetailIntroAnimation() {
      this.detailIntroAnimationKey += 1;
    },
    selectTab(tabKey) {
      const currentIndex = this.tabs.findIndex((tab) => tab.key === this.activeTab);
      const nextIndex = this.tabs.findIndex((tab) => tab.key === tabKey);
      if (nextIndex === -1) return;

      if (nextIndex !== currentIndex) {
        this.tabTransitionName = nextIndex > currentIndex ? "tab-forward" : "tab-backward";
        this.activeTab = tabKey;
        this.playDetailIntroAnimation();
      }
      this.$nextTick(this.updateTabIndicator);
    },
    updateTabIndicator() {
      const tabList = this.$refs.tabList;
      const tabButtons = this.$refs.tabButtons;
      if (!tabList || !tabButtons) return;

      const buttons = Array.isArray(tabButtons) ? tabButtons : [tabButtons];
      const activeIndex = this.tabs.findIndex((tab) => tab.key === this.activeTab);
      const activeButton = buttons[activeIndex];
      if (!activeButton) return;

      this.tabIndicatorStyle = {
        width: `${activeButton.offsetWidth}px`,
        transform: `translateX(${activeButton.offsetLeft}px)`
      };
    },
    handleTabKeydown(event, index) {
      const keyTargets = {
        ArrowLeft: (index - 1 + this.tabs.length) % this.tabs.length,
        ArrowRight: (index + 1) % this.tabs.length,
        Home: 0,
        End: this.tabs.length - 1
      };
      if (!(event.key in keyTargets)) return;

      event.preventDefault();
      const nextIndex = keyTargets[event.key];
      this.selectTab(this.tabs[nextIndex].key);
      this.$nextTick(() => {
        const tabButtons = this.$refs.tabButtons;
        const buttons = Array.isArray(tabButtons) ? tabButtons : [tabButtons];
        if (buttons[nextIndex]) buttons[nextIndex].focus();
      });
    },
    handleProfessionalSectionKeydown(event, index) {
      const keyTargets = {
        ArrowUp: (index - 1 + this.professionalSections.length) % this.professionalSections.length,
        ArrowDown: (index + 1) % this.professionalSections.length,
        Home: 0,
        End: this.professionalSections.length - 1
      };
      if (!(event.key in keyTargets)) return;

      event.preventDefault();
      const nextIndex = keyTargets[event.key];
      this.activeProfessionalSection = this.professionalSections[nextIndex].key;
      this.$nextTick(() => {
        this.updateProfessionalSkillIndicator();
        this.updateOutcomeGradeIndicator();
        const sectionButtons = this.$refs.professionalSectionButtons;
        const buttons = Array.isArray(sectionButtons) ? sectionButtons : [sectionButtons];
        if (buttons[nextIndex]) buttons[nextIndex].focus();
      });
    },
    handleOutcomeGradeKeydown(event, index) {
      if (!this.currentOutcomes.length) return;
      const keyTargets = {
        ArrowLeft: (index - 1 + this.currentOutcomes.length) % this.currentOutcomes.length,
        ArrowRight: (index + 1) % this.currentOutcomes.length,
        Home: 0,
        End: this.currentOutcomes.length - 1
      };
      if (!(event.key in keyTargets)) return;

      event.preventDefault();
      const nextIndex = keyTargets[event.key];
      this.selectedOutcomeGrade = this.currentOutcomes[nextIndex].grade;
      this.$nextTick(() => {
        this.updateOutcomeGradeIndicator();
        const gradeButtons = this.$refs.outcomeGradeButtons;
        const buttons = Array.isArray(gradeButtons) ? gradeButtons : [gradeButtons];
        if (buttons[nextIndex]) buttons[nextIndex].focus();
      });
    },
    async exportTable() {
      if (this.isExportDownloading) return;
      if (!this.hasCurrentStandard) {
        this.notify(`${this.selectedFamily} / ${this.selectedField} 演示表格已加入导出队列`);
        return;
      }
      await this.downloadQualificationTemplate();
    },
    wait(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    },
    saveBlob(blob, filename) {
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
    },
    async downloadQualificationTemplate() {
      const templateUrl = `${process.env.BASE_URL || "./"}templates/任职资格标准样表（组织与人才发展V3.0）.xlsx`;
      const filename = "任职资格标准样表（组织与人才发展V3.0）.xlsx";

      this.isExportDownloading = true;

      try {
        this.exportDownloadProgress = 0;
        await this.wait(80);
        this.exportDownloadProgress = 28;
        await this.wait(120);

        const response = await fetch(templateUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("template download failed");
        const blob = await response.blob();

        this.exportDownloadProgress = 72;
        await this.wait(120);
        this.saveBlob(blob, filename);
        this.exportDownloadProgress = 100;
        await this.wait(420);

        this.notify(`${this.selectedFamily} / ${this.selectedField} 任职资格表格已下载`);
      } catch (error) {
        const link = document.createElement("a");
        link.href = templateUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.exportDownloadProgress = 100;
        this.notify("下载进度获取失败，已切换为浏览器默认下载");
      } finally {
        this.isExportDownloading = false;
        this.exportDownloadProgress = 0;
      }
    },
    notify(message) {
      this.toastMessage = message;
      this.profileOpen = false;
      window.clearTimeout(this.toastTimer);
      this.toastTimer = window.setTimeout(() => {
        this.toastMessage = "";
      }, 2800);
    },
    closeOverlays() {
      this.profileOpen = false;
      this.toastMessage = "";
    }
  }
};
</script>
