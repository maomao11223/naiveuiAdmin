<template>
  <div>
    <n-grid class="n-layout-page-header" :cols="2" x-gap="12">
      <n-gi>
        <n-card :bordered="false" title="篩選條件">
          <n-form
            :model="formValue"
            ref="formRef"
            label-placement="left"
            :label-width="100"
            class="py-4"
          >
            <n-form-item label="分類" path="doctor">
              <n-select
                multiple
                placeholder="請選擇"
                :options="typeList"
                v-model:value="formValue.typeId"
              />
            </n-form-item>
            <n-form-item label="均價" path="doctor">
              <n-slider v-model:value="formValue.averagePrice" :step="100" :max="1000" />
            </n-form-item>
            <n-form-item path="auth" style="margin-left: 100px">
              <n-space>
                <n-button type="primary" :loading="subLoading" @click="formSubmit"
                  >生成選手名單
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
          <hr />
          <n-select
            v-model:value="storeList"
            filterable
            multiple
            tag
            placeholder="输入，按回车确认"
            :show-arrow="false"
            :show="false"
          />
          <n-button class="mt-4" type="primary" :loading="subLoading" @click="createLottery"
            >生成轉盤
          </n-button>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card>
          <!-- type: canvas -->
          <FortuneWheel
            v-if="wheelIsShow"
            style="width: 500px; max-width: 100%"
            :verify="canvasVerify"
            :canvas="canvasOptions"
            :prizes="prizesCanvas"
            @rotate-start="onCanvasRotateStart"
            @rotate-end="onRotateEnd"
          /> </n-card
      ></n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, computed } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import { DownOutlined, AlignLeftOutlined, SearchOutlined, FormOutlined } from '@vicons/antd';
  import { getMenuList } from '@/api/system/menu';
  import { getTreeItem } from '@/utils';

  import FortuneWheel from 'vue-fortune-wheel';
  import 'vue-fortune-wheel/style.css';

  // 🚀 data
  const typeList = ref([
    { value: '0', label: '飲料' },
    { value: '1', label: '正餐' },
  ]);

  const formValue = ref({
    typeId: '',
    averagePrice: 0,
  });

  const storeList = ref([]);

  // 轉盤 start  ////////////////////////
  const wheelIsShow = ref(false);
  const canvasVerify = ref(false); // canvas 模式的转盘是否开启验证
  const canvasOptions = {
    btnWidth: 140,
    borderColor: '#584b43',
    borderWidth: 6,
    lineHeight: 30,
  };
  let prizesCanvas = [
    {
      id: 1, //* 每个奖品唯一的 id, 大于 0 的整数
      name: 'Blue', // 奖品名, type 为 canvas 时的显示值 (type 为 image 时无需此参数)
      value: "Blue's value", //* 奖品值, 旋转结束后的返回值
      bgColor: '#45ace9', // 背景色 (type 为 image 时无需此参数)
      color: '#ffffff', // 字体色 (type 为 image 时无需此参数)
      probability: 30, //* 概率, 最多保留 4 位小数 （所有奖品的概率和必须为 100）
    },
  ];
  const prizeRes = computed(() => {
    return prizesCanvas.find((item) => item.id === prizeId.value) || prizesCanvas[0];
  });
  function onCanvasRotateStart(rotate) {
    if (canvasVerify.value) {
      const verified = true; // true: 测试通过验证, false: 测试未通过验证
      testRequest(verified, verifyDuration * 1000).then((verifiedRes) => {
        if (verifiedRes) {
          rotate(); // 调用回调, 开始旋转
          canvasVerify.value = false; // 关闭验证模式
        } else {
          alert('未通过验证');
        }
      });
      return;
    }
    console.log('onCanvasRotateStart');
  }
  function onRotateEnd(prize) {
    alert(prize.value);
  }

  function testRequest(verified, duration) {
    // 参数 1: 是否通过验证, 2: 延迟时间
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(verified);
      }, duration);
    });
  }
  // 轉盤 end  /////////////////////////////////////

  const message = useMessage();
  const dialog = useDialog();

  const loading = ref(true);
  const subLoading = ref(false);

  function formSubmit() {
    //call api 取得list
    const res = {
      data: ['1', '2', '3'],
    };
    storeList.value = res.data;
  }

  const createLottery = async () => {
    if (storeList.value.length == 0) {
      message.error('選手清單不可為空');
      return;
    }

    wheelIsShow.value = false;

    const isEven = storeList.value.length % 2 == 0 ? true : false;

    let returnValue = 100 / storeList.value.length;

    returnValue = parseFloat(returnValue.toFixed(4));

    const matchOneHundred = 100 - returnValue * storeList.value.length;

    prizesCanvas = await storeList.value.map((store, index) => {
      return {
        id: store,
        name: store,
        bgColor: generateNewColor(),
        color: '#ffffff',
        probability: index == 0 ? returnValue + matchOneHundred : returnValue,
      };
    });
    wheelIsShow.value = true;
  };

  //todo 塞好看的顏色
  const hexCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

  function getCharacter(index) {
    return hexCharacters[index];
  }

  function generateNewColor() {
    let hexColorRep = '#';

    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(Math.random() * hexCharacters.length);
      hexColorRep += getCharacter(randomPosition);
    }

    return hexColorRep;
  }
</script>
