export const darkModeColors = {
  sidebar: {
    background: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    hover: 'hover:bg-gray-700'
  },
  card: {
    background: 'bg-gray-800',
    border: 'border-gray-700'
  },
  states: {
    success: {
      background: 'bg-[#064e3b20]',
      text: 'text-emerald-200',
      border: 'border-emerald-500'
    },
    error: {
      background: 'bg-[#7f1d1d20]',
      text: 'text-red-200',
      border: 'border-red-500'
    }
  },
  table: {
    ballastColumn: 'bg-[#064e3b10]',
    negativeValues: 'bg-[#7f1d1d10]',
    header: 'bg-gray-800'
  },
  modal: {
    background: 'bg-gray-800',
    overlay: 'bg-black/75'
  },
  form: {
    input: {
      background: 'bg-gray-700',
      border: 'border-gray-600',
      disabled: 'opacity-50',
      focus: 'focus:ring-emerald-500'
    }
  },
  tabs: {
    inactive: {
      background: 'bg-gray-700',
      text: 'text-gray-300'
    },
    active: {
      background: 'bg-gray-800',
      text: 'text-emerald-500'
    }
  }
}

export const darkModeClasses = {
  sidebar: `${darkModeColors.sidebar.background} ${darkModeColors.sidebar.border} ${darkModeColors.sidebar.text}`,
  card: `${darkModeColors.card.background} ${darkModeColors.card.border}`,
  successState: `${darkModeColors.states.success.background} ${darkModeColors.states.success.text} ${darkModeColors.states.success.border}`,
  errorState: `${darkModeColors.states.error.background} ${darkModeColors.states.error.text} ${darkModeColors.states.error.border}`,
  input: `${darkModeColors.form.input.background} ${darkModeColors.form.input.border} ${darkModeColors.form.input.focus}`,
  tab: {
    inactive: `${darkModeColors.tabs.inactive.background} ${darkModeColors.tabs.inactive.text}`,
    active: `${darkModeColors.tabs.active.background} ${darkModeColors.tabs.active.text}`
  }
}