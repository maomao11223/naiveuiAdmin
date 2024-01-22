<template>
  <div>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-grid cols="3" responsive="screen">
        <n-grid-item span="1">
          <n-image
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :previewed-img-props="{ style: { border: '8px solid white' } }"
          />
        </n-grid-item>
        <n-grid-item span="2" offset="0 s:0 m:1 l:1 xl:1 2xl:1">
          <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            ref="formRef"
            class="py-8"
          >
            <n-form-item label="姓名" path="name">
              <n-input v-model:value="formValue.name" placeholder="输入姓名" />
            </n-form-item>

            <n-form-item label="選擇餐點" path="doctor">
              <n-select
                placeholder="請選擇餐點"
                :options="doctorList"
                v-model:value="formValue.doctor"
              />
            </n-form-item>

            <n-form-item label="備註" path="remark">
              <n-input v-model:value="formValue.remark" type="textarea" placeholder="請輸入備註" />
            </n-form-item>
            <div style="margin-left: 80px">
              <n-space>
                <n-button type="primary" @click="formSubmit">送出</n-button>
              </n-space>
            </div>
          </n-form>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { useGlobSetting } from '@/hooks/setting';

  const globSetting = useGlobSetting();

  const doctorList = [
    {
      label: '李医生',
      value: 1,
    },
    {
      label: '黄医生',
      value: 2,
    },
    {
      label: '张医生',
      value: 3,
    },
  ];

  const rules = {
    name: {
      required: true,
      message: '请输入预约姓名',
      trigger: 'blur',
    },
    remark: {
      required: true,
      message: '请输入预约备注',
      trigger: 'blur',
    },
    mobile: {
      required: true,
      message: '请输入预约电话号码',
      trigger: ['input'],
    },
    datetime: {
      required: true,
      type: 'number',
      message: '请选择预约时间',
      trigger: ['blur', 'change'],
    },
    doctor: {
      required: true,
      type: 'number',
      message: '请选择预约医生',
      trigger: 'change',
    },
  };

  const formRef: any = ref(null);
  const message = useMessage();
  const { uploadUrl } = globSetting;

  const defaultValueRef = () => ({
    name: sessionStorage.getItem('currentUserName'),
    mobile: '',
    remark: '',
    sex: 1,
    matter: null,
    doctor: null,
    datetime: [],
  });

  let formValue = reactive(defaultValueRef());
  const uploadList = ref([
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ]);
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    token: 'Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=',
  });

  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('验证成功');
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  }

  function resetForm() {
    formRef.value.restoreValidation();
    formValue = Object.assign(unref(formValue), defaultValueRef());
  }

  function uploadChange(list: string[]) {
    console.log(list);
  }
</script>
